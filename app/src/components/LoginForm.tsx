import React, { useState } from "react"

interface Props { }

export const LoginForm: React.FC<Props> = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    // Login at server

  }

  return (
    <form>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          placeholder="Username"
          value={username} required
          onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          value={password} required
          onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button id="buttonSubmit" type="submit" onClick={handleSubmit} >Login</button>
    </form>
  )
}