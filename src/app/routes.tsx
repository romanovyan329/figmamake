import { createBrowserRouter } from 'react-router';
import { HomePageNew } from './pages/HomePageNew';
import { TournamentsPage } from './pages/TournamentsPage';
import { TournamentDetailsPage } from './pages/TournamentDetailsPage';
import { MySeasonPage } from './pages/MySeasonPage';
import { WeatherPageMobile } from './pages/WeatherPageMobile';
import { MapPageMobile } from './pages/MapPageMobile';
import { RoutesPageMobile } from './pages/RoutesPageMobile';
import { LogbookPageMobile } from './pages/LogbookPageMobile';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { TripDetailsPageMobile } from './pages/TripDetailsPageMobile';
import { BottomNav } from './components/BottomNav';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HomePageNew />
      </Layout>
    ),
  },
  {
    path: '/tournaments',
    element: (
      <Layout>
        <TournamentsPage />
      </Layout>
    ),
  },
  {
    path: '/tournaments/:id',
    element: <TournamentDetailsPage />,
  },
  {
    path: '/season',
    element: (
      <Layout>
        <MySeasonPage />
      </Layout>
    ),
  },
  {
    path: '/weather',
    element: (
      <Layout>
        <WeatherPageMobile />
      </Layout>
    ),
  },
  {
    path: '/map',
    element: (
      <Layout>
        <MapPageMobile />
      </Layout>
    ),
  },
  {
    path: '/routes',
    element: (
      <Layout>
        <RoutesPageMobile />
      </Layout>
    ),
  },
  {
    path: '/logbook',
    element: (
      <Layout>
        <LogbookPageMobile />
      </Layout>
    ),
  },
  {
    path: '/logbook/:tripId',
    element: <TripDetailsPageMobile />,
  },
  {
    path: '/profile',
    element: (
      <Layout>
        <ProfilePage />
      </Layout>
    ),
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
]);