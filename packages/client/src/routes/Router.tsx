import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../pages/layouts/MainLayout';
import Dashboard from '../pages/protected/Dashboard/Dashboard';
import AccountPage from '../pages/protected/Settings/Account/AccountPage';
import ChangePasswordPage from '../pages/protected/Settings/ChangePassword/ChangePasswordPage';
import ProfilePage from '../pages/protected/Settings/Profile/ProfilePage';
import SettingsPage from '../pages/protected/Settings/SettingsPage';
import SubscriptionPage from '../pages/protected/Settings/Subscription/SubscriptionPage';
import TeamPage from '../pages/protected/Settings/Team/TeamPage';
import TagDetailPage from '../pages/protected/Tag/TagDetailPage';
import TagsListPage from '../pages/protected/Tag/TagListPage';
import TaskDetailPage from '../pages/protected/Task/TaskDetailPage';
import TaskListPage from '../pages/protected/Task/TaskListPage';
import ForgotPasswordPage from '../pages/public/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from '../pages/public/ResetPassword/ResetPasswordPage';
import SignInPage from '../pages/public/SignIn/SignInPage';
import SignUpPage from '../pages/public/SignUp/SignUpPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { Paths } from './paths';
import MagicLinkPage from '../pages/MagicLink/MagicLinkPage';
import AuthCallback from '../pages/public/AuthCallback';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path={Paths.Tasks}
            element={
              <PrivateRoute redirectPath="/">
                <TaskListPage />
              </PrivateRoute>
            }
          />
          <Route element={<TaskDetailPage />} path={Paths.TaskDetail} />
          <Route element={<TagDetailPage />} path={Paths.TagDetail} />

          <Route element={<TagsListPage />} path={Paths.Tags} />
          <Route element={<SettingsPage />} path={Paths.Settings}>
            <Route path="profile" index element={<ProfilePage />} />
            <Route path="password" element={<ChangePasswordPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Route>
      <Route element={<PublicRoute />}>
        <Route element={<AuthCallback />} path={Paths.AuthCallback} />
        <Route element={<SignInPage />} path={Paths.SignIn}></Route>
        <Route element={<SignUpPage />} path={Paths.SignUp}></Route>
        <Route
          element={<ForgotPasswordPage />}
          path={Paths.ForgotPassword}
        >
        </Route>
        <Route
          element={<ResetPasswordPage />}
          path={Paths.ResetPassword}
        >
        </Route>
        <Route element={<MagicLinkPage />} path={Paths.MagicLink}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
