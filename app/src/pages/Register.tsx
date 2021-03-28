import React, { useState } from "react"

interface Props { }

interface Credentials {
  username: string,
  password: string,
  confirmPassword?: string
}

export const Register: React.FC<Props> = () => {
  
  const [{ username, password, confirmPassword }, setCredentials] = useState<Credentials>({ username: "", password: "" })

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {

    /* sets the right property in the state object
        ...cred         -> destructuring with ...
        [e.target.name] -> dynamic property name with [] */
    setCredentials(cred => ({ ...cred, [e.target.name]: e.target.value }))
  }

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) { console.error("Passwords dont match"); return }

    // TODO: Send to server
    console.log("Registering ...")

  }

  return (
    <form>
      <div>
        <label htmlFor="username" >Username</label>
        <input
          id="username"
          name="username"
          placeholder="Username"
          value={username} required
          onChange={handleInput} />
      </div>

      <div>
        <label htmlFor="password" >Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          value={password} required
          onChange={handleInput} />
      </div>

      <div>
        <label htmlFor="confirmPassword" >Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword" required
          placeholder="Confirm Password"
          pattern={password}
          onChange={(e) => {
            // Set custom error mesesage, instead of default "pattern mismatch" message
            e.target.setCustomValidity(e.target.validity.patternMismatch ? "Passwords must match" : "")
            handleInput(e)
          }} />
      </div>

      <button id="buttonSubmit" type="submit" onClick={handleSubmit} >Register</button>
    </form>
  )
}