import './Login.css'

export default function Login() {
  return (
    <main className="admin-login">
      <section className="admin-login__card" aria-labelledby="admin-login-title">
        <header className="admin-login__header">
          <h1 id="admin-login-title">Login to your account</h1>
          <p>Enter your email below to login to your account</p>
        </header>

        <form className="admin-login__form" onSubmit={(event) => event.preventDefault()}>
          <div className="admin-login__field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-login__field">
            <div className="admin-login__label-row">
              <label htmlFor="admin-password">Password</label>
            </div>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="admin-login__button admin-login__button--primary" type="submit">
            Login
          </button>

          <div className="admin-login__separator" aria-hidden="true">
            <span>Or continue with</span>
          </div>

          <button className="admin-login__button admin-login__button--outline" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.15a11 11 0 0 0 0 9.9l3.69-2.84Z"
              />
              <path
                fill="currentColor"
                d="M12 5.36c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.85 6.05l3.69 2.84C6.71 7.29 9.14 5.36 12 5.36Z"
              />
            </svg>
            Login with Google
          </button>
        </form>
      </section>
    </main>
  )
}
