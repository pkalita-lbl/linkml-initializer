import { AppShell, Header, Group, Title } from "@mantine/core";
import React from "react";

function Layout({ children }) {
  return (
    <AppShell
      padding="md"
      fixed={false}
      header={
        <Header>
          <Group sx={{ height: '100%' }} p="md">
            <Title order={1}>LinkML Initializer</Title>
          </Group>
        </Header>
      }
    >
      { children }
    </AppShell>
  )
}

export default Layout;
