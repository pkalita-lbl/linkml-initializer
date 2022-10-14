import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { MantineProvider } from '@mantine/core';

import Root from './routes/Root'
import Layout from './components/Layout';
import Edit from './routes/Edit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/edit',
    element: <Edit />
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
