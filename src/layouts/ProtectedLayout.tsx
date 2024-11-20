/* eslint-disable react-hooks/rules-of-hooks */
import appIcon from '@/assets/imgs/bg.jpg';
import CustomLoader from '@/components/custom/CustomLoader';
import { ROUTER } from '@/configs/router';

import { useAuthContext } from '@/hooks/context';
import { useAppDispatch } from '@/hooks/redux';
import { NewsActions } from '@/redux/reducers/news/news.action';
import { TimeoffActions } from '@/redux/reducers/timeoff/timeoff.action';
import { IUser } from '@/types/models/IUser';
import { RESOURCES, SCOPES, isGrantedPermission } from '@/utils/permissions';
import {
  Anchor,
  AppShell,
  Avatar,
  Box,
  Button,
  Group,
  Header,
  Image,
  Modal,
  Navbar,
  Popover,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
  rem,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrandAsana,
  IconClockCheck,
  IconGitPullRequest,
  IconHistory,
  IconLicense,
  IconLogout,
  IconPassword,
  IconShield,
  IconUser
} from '@tabler/icons-react';
import {
  ReactNode,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

interface NavLinkProps {
  icon: JSX.Element;
  color: string;
  label: string;
  to: string;
  auth: boolean;
}

const NavLink = ({ icon, color, label, to }: NavLinkProps) => {
  const navigate = useNavigate();

  return (
    <UnstyledButton
      onClick={() => navigate(to, { replace: true })}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0]
        }
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

interface UserProps {
  profile: IUser | null;
}

const User = ({ profile }: UserProps) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { changePwd } = useAuthContext();

  interface WrapperProps {
    children: ReactNode;
  }

  const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
      <UnstyledButton
        sx={{
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[2]
          }
        }}
      >
        {children}
      </UnstyledButton>
    );
  };
  const [opened, { close, open }] = useDisclosure();
  const [_newPwd, setNewPwd] = useState('');
  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `${rem(1)} solid ${
          theme.colorScheme === 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`
      }}
    >
      <Modal centered title="Thay đổi mật khẩu" opened={opened} onClose={close}>
        <Stack spacing={'lg'}>
          <TextInput
            onChange={(e) => setNewPwd(e.currentTarget.value)}
            label="Mật khẩu mới"
          />
          <Group position="right">
            <Button variant="outline" onClick={() => close()}>
              Huỷ
            </Button>
            <Button
              onClick={() => {
                changePwd({ password: _newPwd });
                close();
              }}
            >
              Cập nhật
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Popover position={'top-end'} shadow="xs" withArrow arrowSize={10}>
        <Popover.Target>
          <UnstyledButton
            sx={{
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[0]
                  : theme.black,

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0]
              }
            }}
          >
            <Group>
              <Avatar radius="xl" src={profile?.avatarFileId} />
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {profile?.fullName || 'Tên tài khoản'}
                </Text>
              </Box>
            </Group>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown p={'xs'}>
          <Wrapper>
            <Text onClick={() => navigate(`${ROUTER.PROFILE}`)} fz={'xs'}>
              <Group spacing={2}>
                <IconUser size={'1rem'} />
                Thông tin cá nhân
              </Group>
            </Text>
          </Wrapper>
          <Wrapper>
            <Text onClick={() => open()} fz={'xs'}>
              <Group spacing={2}>
                <IconPassword size={'1rem'} />
                Thay đổi mật khẩu
              </Group>
            </Text>
          </Wrapper>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
};

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { logout, state, getAuthorities, getProfile } = useAuthContext();
  const { authorities, profile } = state;
  const [_authorities, setAuthorities] = useState(authorities);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    navigate(ROUTER.LOGIN);
    logout();
  };

  // if (!localStorage.getItem('token')) {
  //   return <Navigate to={ROUTER.LOGIN} />;
  // }

  useLayoutEffect(() => {
    getAuthorities();
    getProfile();
  }, [dispatch, getAuthorities, getProfile]);

  useEffect(() => {
    setAuthorities(authorities);
  }, [authorities]);

  const navLinks: NavLinkProps[] = [
    {
      icon: <IconBrandAsana size="1rem" />,
      color: 'grape',
      label: 'Quản Lý Danh Mục Đơn Vị Hành Chính', 
      to: ROUTER.UNIT,
      auth: isGrantedPermission(_authorities, RESOURCES.UNIT, SCOPES.VIEW)
    },
    {
      icon: <IconUser size={'1rem'} />,
      color: 'blue',
      label: 'Quản Lý Người Dùng',
      to: ROUTER.USER,
      auth: isGrantedPermission(_authorities, RESOURCES.USER, SCOPES.VIEW)
    },
    // {
    //   icon: <IconShield size={'1rem'} />,
    //   color: 'red',
    //   label: 'Quản Lý Quyền',
    //   to: ROUTER.PERMISSION,
    //   auth: isGrantedPermission(_authorities, RESOURCES.PERMISSION, SCOPES.VIEW)
    // },
    {
      icon: <IconHistory size={'1rem'} />,
      color: 'gray',
      label: 'Lịch Sử Truy Cập',
      to: ROUTER.SESSION,
      auth: isGrantedPermission(_authorities, RESOURCES.SESSION, SCOPES.VIEW)
    }
  ];
  return (
    <>
      <AppShell
        styles={{
          main: {
            maxWidth: 'calc(100vw - 32px)'
          }
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={true}
            width={{ sm: 200, lg: 350 }}
          >
            <Navbar.Section grow mt="0">
              <div>
                {navLinks
                  .filter((link) => link.auth === true)
                  .map((link) => (
                    <NavLink {...link} key={link.label} />
                  ))}
              </div>
            </Navbar.Section>
            <Navbar.Section>
              <User profile={profile} />
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={60}>
            <Group position="apart" sx={{ height: '100%' }} px={20}>
              <Group>
                <Anchor href={ROUTER.BASE}>
                  <Image src={appIcon} height={32} width={32} />
                </Anchor>
                <Text fw={600} fz="lg">
                  Hệ Thống Quản Lý Chăn Nuôi
                </Text>
              </Group>
              <Group>
                <Button
                  onClick={handleLogout}
                  variant="subtle"
                  color="red"
                  leftIcon={<IconLogout size={20} />}
                >
                  Đăng xuất
                </Button>
              </Group>
            </Group>
          </Header>
        }
      >
        <Suspense fallback={<CustomLoader />}>
          <Outlet />
        </Suspense>
      </AppShell>
    </>
  );
};

export default ProtectedLayout;