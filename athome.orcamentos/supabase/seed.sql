insert into budget.settings (user_id, company_name, default_labor_cost)
values ('00000000-0000-0000-0000-000000000000', 'Empresa Exemplo', 150)
on conflict (user_id) do update set company_name = excluded.company_name;
