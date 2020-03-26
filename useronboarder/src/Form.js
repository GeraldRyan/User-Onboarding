import React, { useState, useEffect } from 'react';
import './Form.css'
import axios from 'axios'
import * as yup from 'yup'


const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field bro."),
  email: yup.string().email("Must be a valid Email Address.").required("Must include an email address"),
  password: yup.string().required("Must choose a password"),
  terms: yup.boolean().oneOf([true], "Please agree to terms of service."),
})



export default function Form()
{

  // Set users to be populated from returned success response, to be displayed
  const [users, setUsers] = useState([])


  // state for whether disable button
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    terms: '',
    password: '',
  })
  const [errors, setErrors] = useState({

    name: '',
    email: '',
    password: '',
    terms: ''
  })

  const [post, setPost] = useState([]);

  useEffect(() =>
  {
    formSchema.isValid(formState).then(valid =>
    {
      setButtonDisabled(!valid);
    })
  }, [formState])


  const formSubmit = e =>
  {
    console.log("Form Submitting via Axios.post() and then reset Form state")
    e.preventDefault()
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res =>
      {
        setPost(res.data)
        console.log("success", post)
        setFormState({
          name: '',
          email: '',
          terms: '',
          password: '',
        })
        setUsers(users => [...users, res.data])  // I might need help with this. It lags. 
        console.log("users",users)
        console.log("post: ", post)

      })
      .catch(err => console.log(err.response));
  };

  const validateChange = e =>
  {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid =>
      {
        setErrors({
          ...errors,
          [e.target.name]: ""
        })
      })
      .catch(err =>
      {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0]
        })
      })
  }

  const inputChange = e =>
  {
    e.persist()
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    }

    validateChange(e);
    setFormState(newFormData)
  }


  return (
    <div id='users'>
      <form onSubmit={formSubmit}>
        <label htmlFor="name">Name:
        <input
            type="text"
            name="name"
            value={formState.name}
            onChange={inputChange} 
            />
            {errors.name.length > 0 ? <p className="error"> {errors.name}</p> : null}
        </label>
        <label htmlFor="email">
          Email:
        <input
            type="text"
            name="email"
            value={formState.email}
            onChange={inputChange} 
            />
            {errors.email.length > 0 ? <p className="error"> {errors.email}</p> : null}
        </label>

        <label htmlFor="Password">
          Password:
        <input
            type="password"
            name="password"
            value={formState.password}
            onChange={inputChange} 
            />
            {errors.password.length > 0 ? <p className="error"> {errors.password}</p> : null}

        </label>
        {/* <label htmlFor="">
        Re-enter Password:
        <input 
        type="text"
        name="name" 
        value={formState.name}
        onChange={inputChange} />
      </label> */}

        <label htmlFor="agreement">
          I agree to the terms:
        <input
            type="checkbox"
            name="terms"
            checked={formState.terms}
            onChange={inputChange} />
        </label>
        <button type="submit" disabled={buttonDisabled}>Submit</button>
      </form>
      <pre>{JSON.stringify(users,null,2)}</pre>

    </div>
  )

}