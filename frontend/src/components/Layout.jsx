import { AppShell, Header, Group, Title, Container } from "@mantine/core";
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
      <Container size="lg">
        { children }
      </Container>
    </AppShell>
  )
}

export default Layout;
