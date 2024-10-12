// 👇 START WORKING ON LINE 36 (the set up is done for you -> go straight to writing tests)
import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import server from '../../backend/mock-server'
import Auth from './Auth'

describe('Auth component', () => {
  // ❗ mock API setup
  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })

  let userInput, passInput, loginBtn // ❗ DOM nodes of interest
  let user // ❗ tool to simulate interaction with the DOM

  beforeEach(() => {
    // ❗ render the component to test
    render(<Auth />)
    // ❗ set up the user variable
    user = userEvent.setup()
    // ❗ set the DOM nodes of interest into their variables
    userInput = screen.getByPlaceholderText('type username')
    passInput = screen.getByPlaceholderText('type password')
    loginBtn = screen.getByTestId('loginBtn')
  })

  // ❗ These are the users registered in the testing database
  const registeredUsers = [
    { id: 1, username: 'Shakira', born: 1977, password: 'Suerte1977%' },
    { id: 2, username: 'Beyoncé', born: 1981, password: 'Halo1981#' },
    { id: 3, username: 'UtadaHikaru', born: 1983, password: 'FirstLove1983;' },
    { id: 4, username: 'Madonna', born: 1958, password: 'Vogue1958@' },
  ]

  // 👇 START WORKING HERE
  test('[1] Inputs acquire the correct values when typed on', async () => {
    // ✨ type some text in the username input (done for you)
    await user.type(userInput, 'gabe')
    // ✨ assert that the input has the value entered (done for you)
    expect(userInput).toHaveValue('gabe')
    // ✨ type some text in the password input
    await user.type(passInput, '1234')
    // ✨ assert that the input has the value entered
    expect(passInput).toHaveValue('1234')
  })
  test('[2] Submitting form clicking button shows "Please wait..." message', async () => {
    // ✨ type whatever values on username and password inputs
    await user.type(userInput, 'gabe')
    await user.type(passInput, '1234')
    // ✨ click the Login button
    await user.click(loginBtn)
    // ✨ assert that the "Please wait..." message is visible in the DOM
    expect(screen.getByText('Please wait...')).toBeVisible()
  })
  test('[3] Submitting form typing [ENTER] shows "Please wait..." message', async () => {
    // ✨ type whatever values in username and password inputs
    await user.type(userInput, 'gabe')
    await user.type(passInput, '1234')
    // ✨ hit the [ENTER] key on the keyboard
    await user.keyboard('[ENTER]')
    // ✨ assert that the "Please wait..." message is visible in the DOM
    expect(screen.getByText('Please wait...')).toBeVisible()
  })
  test('[4] Submitting an empty form shows "Invalid Credentials" message', async () => {
    // ✨ submit an empty form
    await user.click(loginBtn)
    // ✨ assert that the "Invalid Credentials" message eventually is visible
    expect(await screen.findByText('Invalid Credentials')).toBeVisible()
  })
  test('[5] Submitting incorrect credentials shows "Invalid Credentials" message', async () => {
    // ✨ type whatever username and password and submit form
    await user.type(userInput, 'gabe')
    await user.type(passInput, '1234')
    await user.click(loginBtn)
    // ✨ assert that the "Invalid Credentials" message eventually is visible
    expect(await screen.findByText('Invalid Credentials')).toBeVisible()
  })
  for (const usr of registeredUsers) {
    test(`[6.${usr.id}] Logging in ${usr.username} makes the following elements render:
      - correct welcome message
      - correct user info (ID, username, birth date)
      - logout button`, async () => {
      // ✨ type valid credentials and submit form
      await user.type(userInput, usr.username)
      await user.type(passInput, usr.password)
      await user.click(loginBtn)
      await waitFor(() => {
        // ✨ assert that the correct welcome message is eventually visible
        // ✨ assert that the correct user info appears is eventually visible
        // ✨ assert that the logout button appears
        expect(screen.getByText(`Welcome back, ${usr.username}. We LOVE you!`)).toBeVisible()
        expect(screen.getByText(`ID: ${usr.id}, Username: ${usr.username}, Born: ${usr.born}`)).toBeVisible()
        expect(screen.getByText('Logout')).toBeVisible()
        expect(screen.getByTestId('logoutBtn')).toBeVisible()
      })
    })
  }
  test('[7] Logging out a logged-in user displays goodbye message and renders form', async () => {
    // ✨ type valid credentials and submit
    const { username, password } = registeredUsers[0]
    await user.type(userInput, username)
    await user.type(passInput, password)
    await user.click(loginBtn)
    // ✨ await the welcome message
    await screen.findByText(`Welcome back, ${username}. We LOVE you!`)
    // ✨ click on the logout button (grab it by its test id)
    await user.click(screen.getByTestId('logoutBtn'))
    // ✨ assert that the goodbye message is eventually visible in the DOM
    expect(await screen.findByText('Bye! Please, come back soon.')).toBeVisible()
    // ✨ assert that the form is visible in the DOM (select it by its test id)
    expect(screen.getByTestId('loginForm')).toBeVisible()
    // screen.debug()
  })
})
