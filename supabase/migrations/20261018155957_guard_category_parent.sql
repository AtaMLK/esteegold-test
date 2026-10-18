create function public.validate_category_branch() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if new.deleted_at is not null then return new; end if;
  perform 1 from public.commerce_branches where name=new.branch and deleted_at is null for share;
  if not found then raise exception 'Choose an available branch.'; end if;
  return new;
end;
$$;
revoke execute on function public.validate_category_branch() from public,anon,authenticated;
grant execute on function public.validate_category_branch() to service_role;
create trigger validate_category_branch before insert or update of branch,deleted_at on public.commerce_categories for each row execute function public.validate_category_branch();
