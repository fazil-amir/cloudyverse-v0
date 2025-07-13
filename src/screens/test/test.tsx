import { Suspense, lazy, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { Container, Stack, Divider, NavLink, Loader, Flex } from '@mantine/core';

const sections = [
  { path: 'layout', label: 'Layout', component: lazy(() => import('./layout')) },
  { path: 'inputs', label: 'Inputs', component: lazy(() => import('./inputs')) },
  { path: 'combobox', label: 'Combobox', component: lazy(() => import('./combobox')) },
  { path: 'buttons', label: 'Buttons', component: lazy(() => import('./buttons')) },
  { path: 'navigation', label: 'Navigation', component: lazy(() => import('./navigation')) },
  { path: 'feedback', label: 'Feedback', component: lazy(() => import('./feedback')) },
  { path: 'overlays', label: 'Overlays', component: lazy(() => import('./overlays')) },
  { path: 'data-display', label: 'Data display', component: lazy(() => import('./data-display')) },
  { path: 'typography', label: 'Typography', component: lazy(() => import('./typography')) },
  { path: 'miscellaneous', label: 'Miscellaneous', component: lazy(() => import('./miscellaneous')) },
  { path: 'api-test', label: 'API Test', component: lazy(() => import('./api-test')) },
];

const Test = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current section from URL path
  const currentPath = location.pathname.split('/').pop() || 'layout';
  
  // If we're at /test with no sub-route, redirect to /test/layout
  useEffect(() => {
    if (location.pathname === '/test') {
      navigate('/test/layout', { replace: true });
    }
  }, [location.pathname, navigate]);

  const DefaultSection = sections[0].component;

  return (
    <Container size="xl" py="xl" fluid>
      <Flex align="flex-start" gap="xl">
        {/* Sidebar */}
        <Stack gap="xs" style={{ minWidth: 180, maxHeight: '90vh', overflowY: 'auto' }}>
          {sections.map((section) => (
            <NavLink
              key={section.path}
              label={section.label}
              active={currentPath === section.path}
              onClick={() => navigate(`/test/${section.path}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>
        <Divider orientation="vertical" />
        {/* Main Section */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Suspense fallback={<Loader />}>
            <Routes>
              {sections.map((section) => (
                <Route
                  key={section.path}
                  path={section.path}
                  element={<section.component />}
                />
              ))}
              {/* Default route - redirect to layout */}
              <Route path="*" element={<DefaultSection />} />
            </Routes>
          </Suspense>
        </div>
      </Flex>
    </Container>
  );
};

export default Test; 