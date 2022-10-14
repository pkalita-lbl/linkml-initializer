import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';

import Root from './routes/Root'
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  }
])

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </MantineProvider>
  )
}

export default App
