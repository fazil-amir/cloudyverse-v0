import { Text, ThemeIcon, NavLink, ActionIcon, Container, Flex, Divider, Menu, Avatar } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom'
import { 
  IconCloud, 
  IconHome, 
  IconSettings, 
  IconTestPipe,
  IconSun,
  IconMoon,
  IconLogin,
  IconLogout,
  IconUser
} from '@tabler/icons-react'
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logoutUser } from '@/store/slices/user.slice'

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  console.log({
    user,
    isAuthenticated
  })

  return (
    <>
      <nav style={{ 
        padding: 'var(--mantine-spacing-md) 0', 
      }}>
        <Container fluid>
          <Flex justify="space-between" align="center" gap="xs">
            
            <Flex gap="lg" flex="col">
              
              {/* Logo and Title */}
              <Flex gap="xs" align="center">
                <ThemeIcon size="xl" radius="xl" variant="gradient" gradient={{ from: 'myColor.4', to: 'myColor.8' }}>
                  <IconCloud size="2rem" />
                </ThemeIcon>
                <Text size="xl" fw={700} variant="gradient" gradient={{ from: 'myColor.4', to: 'myColor.8' }}>
                  Cloudyverse
                </Text>
              </Flex>

              {/* Navigation Links */}
              <NavLink
                component={Link}
                to="/"
                label="Home"
                leftSection={<IconHome size="1.2rem" />}
                variant="light"
                
              />
              <NavLink
                component={Link}
                to="/settings"
                label="Settings"
                leftSection={<IconSettings size="1.2rem" />}
                variant="light"
                
              />
              <NavLink
                component={Link}
                to="/setup"
                label="Setup"
                leftSection={<IconSettings size="1.2rem" />}
                variant="light"
              />
              {!isAuthenticated ? (
                <NavLink
                  component={Link}
                  to="/login"
                  label="Login"
                  leftSection={<IconLogin size="1.2rem" />}
                  variant="light"
                />
              ) : null}
              <NavLink
                component={Link}
                to="/test"
                label="Test"
                leftSection={<IconTestPipe size="1.2rem" />}
                variant="light"
                
              />
            </Flex>

            {/* User Menu / Theme Toggle */}
            <Flex gap="xs" align="center">
              {isAuthenticated && user ? (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Avatar 
                      color="blue" 
                      radius="xl"
                      style={{ cursor: 'pointer' }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </Avatar>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>User</Menu.Label>
                    <Menu.Item leftSection={<IconUser size={14} />}>
                      {user.email}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      leftSection={<IconLogout size={14} />}
                      onClick={handleLogout}
                      color="red"
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : null}

              <ActionIcon
                onClick={toggleColorScheme}
                variant="light"
                size="lg"
                aria-label="Toggle color scheme"
              >
                {computedColorScheme === 'light' ? (
                  <IconMoon size="1.2rem" />
                ) : (
                  <IconSun size="1.2rem" />
                )}
              </ActionIcon>
            </Flex>
          </Flex>
        </Container>
      </nav>
      <Divider />
    </>
  )
}

export default Navbar 