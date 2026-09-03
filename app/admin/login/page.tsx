export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next = searchParams.next ?? "/admin";
  const hasError = searchParams.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <form
        action="/api/admin/login"
        method="POST"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm"
      >
        <h1 className="mb-4 text-lg font-semibold text-neutral-900">Вход в админку</h1>

        <input type="hidden" name="next" value={next} />

        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="mb-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base focus:border-neutral-500 focus:outline-none"
        />

        {hasError && (
          <p className="mb-3 text-sm text-red-600">Неверный пароль. Попробуйте ещё раз.</p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-base font-medium text-white transition hover:bg-neutral-700"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
