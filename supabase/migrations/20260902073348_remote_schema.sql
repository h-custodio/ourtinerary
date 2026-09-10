set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "service_role";

create table "public"."activity" (
  "activity_id" uuid                   not null default gen_random_uuid(),
  "plan_id"     uuid                   not null,
  "title"       text                   not null,
  "description" text                   not null,
  "start_time"  time without time zone not null,
  "end_time"    time without time zone not null,
  "location"    text                   not null,
  constraint "activity_check" check ((start_time < end_time)),
  constraint "activity_pkey" primary key (activity_id)
);

alter table "public"."activity"
  enable row level security;

create table "public"."friend" (
  "user_id"   uuid    not null,
  "friend_id" uuid    not null,
  "accepted"  boolean not null default false,
  constraint "friend_check" check ((user_id <> friend_id)),
  constraint "friend_pkey" primary key (user_id, friend_id)
);

alter table "public"."friend"
  enable row level security;

create table "public"."plan_member" (
  "plan_id"   uuid    not null,
  "user_id"   uuid    not null,
  "clearance" numeric not null default '4'::numeric,
  constraint "plan_member_pkey" primary key (plan_id, user_id)
);

alter table "public"."plan_member"
  enable row level security;

create table "public"."plan" (
  "plan_id"     uuid not null default gen_random_uuid(),
  "title"       text not null,
  "description" text not null,
  "date"        date not null,
  constraint "plan_pkey" primary key (plan_id)
);

alter table "public"."plan"
  enable row level security;

create table "public"."profile" (
  "user_id"      uuid not null,
  "display_name" text not null,
  constraint "profile_pkey" primary key (user_id)
);

alter table "public"."profile"
  enable row level security;

create or replace function public.rls_auto_enable()
  returns event_trigger
  language plpgsql
  security definer
  set search_path to 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

alter table "public"."friend"
  add constraint "friend_friend_id_fkey" foreign key (friend_id) references auth.users(id) on delete cascade;

alter table "public"."friend"
  add constraint "friend_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

alter table "public"."activity"
  add constraint "activity_plan_id_fkey" foreign key (plan_id) references public.plan(plan_id) on delete cascade;

alter table "public"."plan_member"
  add constraint "plan_member_plan_id_fkey" foreign key (plan_id) references public.plan(plan_id) on delete cascade;

alter table "public"."plan_member"
  add constraint "plan_member_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

alter table "public"."profile"
  add constraint "profile_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

create index plan_member_user_id_index on public.plan_member using btree (user_id);

create policy "Level 0–1 members can CRUD activities belonging to their plan" on "public"."activity"
  for all
  to "authenticated"
  using ((exists ( select 1
   from public.plan_member pm
  where ((pm.plan_id = activity.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance <= (1)::numeric)))))
  with check ((EXISTS ( SELECT 1
   FROM public.plan_member pm
  WHERE ((pm.plan_id = activity.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance <= (1)::numeric)))));

create policy "Users can approve friend requests" on "public"."friend"
  for update
  to "authenticated"
  using (((auth.uid() = friend_id) AND (accepted = false)))
  with check (((auth.uid() = friend_id) AND (accepted = true)));

create policy "Users can befriend other users" on "public"."friend"
  for insert
  to "authenticated"
  with check ((auth.uid() = user_id));

create policy "Users can see their own friends" on "public"."friend"
  for select
  to "authenticated"
  using (((auth.uid() = user_id) or (auth.uid() = friend_id)));

create policy "Users can unfriend" on "public"."friend"
  for delete
  to "authenticated"
  using (((auth.uid() = user_id) or (auth.uid() = friend_id)));

create policy "Level 0-1 members can edit plan details" on "public"."plan"
  for update
  to "authenticated"
  using ((exists ( select 1
   from public.plan_member pm
  where ((pm.plan_id = plan.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance <= (1)::numeric)))))
  with check ((EXISTS ( SELECT 1
   FROM public.plan_member pm
  WHERE ((pm.plan_id = plan.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance <= (1)::numeric)))));

create policy "Users can create a plan" on "public"."plan"
  for insert
  to "authenticated"
  with check ((auth.uid() IS NOT NULL));

create policy "Users can delete plans in which they are the host" on "public"."plan"
  for delete
  to "authenticated"
  using ((exists ( select 1
   from public.plan_member pm
  where ((pm.plan_id = plan.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance = (0)::numeric)))));

create policy "Users can view plans they are part of" on "public"."plan"
  for select
  to "authenticated"
  using ((exists ( select 1
   from public.plan_member pm
  where ((pm.plan_id = plan.plan_id) AND (pm.user_id = auth.uid())))));

create policy "All plan members can see the plan" on "public"."plan_member"
  for select
  to "authenticated"
  using ((auth.uid() = user_id));

create policy "Host can remove users from plan" on "public"."plan_member"
  for delete
  to "authenticated"
  using ((exists ( select 1
   from public.plan_member pm
  where ((pm.plan_id = plan_member.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance <= (2)::numeric)))));

create policy "Host can update clearance level of other users" on "public"."plan_member"
  for update
  to "authenticated"
  using ((exists ( select 1
   from public.plan_member pm
  where ((pm.plan_id = plan_member.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance = (0)::numeric)))))
  with check ((EXISTS ( SELECT 1
   FROM public.plan_member pm
  WHERE ((pm.plan_id = plan_member.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance = (0)::numeric)))));

create policy "Level 0-2 members can invite other users" on "public"."plan_member"
  for insert
  to "authenticated"
  with check ((EXISTS ( SELECT 1
   FROM public.plan_member pm
  WHERE ((pm.plan_id = plan_member.plan_id) AND (pm.user_id = auth.uid()) AND (pm.clearance <= (2)::numeric)))));

create policy "Users can see their own profile" on "public"."profile"
  for select
  to "authenticated"
  using ((auth.uid() = user_id));

create event trigger "ensure_rls"
  on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function "public"."rls_auto_enable"();

grant execute on function "public"."rls_auto_enable"() to public, "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."activity" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."friend" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."plan" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."plan_member" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."profile" to "anon", "authenticated", "postgres", "service_role";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "anon";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "authenticated";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "service_role";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "anon";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "authenticated";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "service_role";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "anon";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "authenticated";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "service_role";

