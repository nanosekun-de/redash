import React, { useMemo } from "react";
import { first, includes } from "lodash";
import Menu from "antd/lib/menu";
import Link from "@/components/Link";
import HelpTrigger from "@/components/HelpTrigger";
import CreateDashboardDialog from "@/components/dashboards/CreateDashboardDialog";
import { useCurrentRoute } from "@/components/ApplicationArea/Router";
import { Auth, currentUser } from "@/services/auth";
import settingsMenu from "@/services/settingsMenu";
import logoUrl from "@/assets/images/redash_icon_small.png";

import DesktopOutlinedIcon from "@ant-design/icons/DesktopOutlined";
import CodeOutlinedIcon from "@ant-design/icons/CodeOutlined";
import AlertOutlinedIcon from "@ant-design/icons/AlertOutlined";
import PlusOutlinedIcon from "@ant-design/icons/PlusOutlined";
import QuestionCircleOutlinedIcon from "@ant-design/icons/QuestionCircleOutlined";
import SettingOutlinedIcon from "@ant-design/icons/SettingOutlined";

import VersionInfo from "./VersionInfo";
import "./DesktopNavbar.less";

function NavbarSection({ children, ...props }) {
  return (
    <Menu selectable={false} mode="vertical" theme="dark" {...props}>
      {children}
    </Menu>
  );
}

function useNavbarActiveState() {
  const currentRoute = useCurrentRoute();

  return useMemo(
    () => ({
      dashboards: includes(
        [
          "Dashboards.List",
          "Dashboards.Favorites",
          "Dashboards.My",
          "Dashboards.ViewOrEdit",
          "Dashboards.LegacyViewOrEdit",
        ],
        currentRoute.id
      ),
      queries: includes(
        [
          "Queries.List",
          "Queries.Favorites",
          "Queries.Archived",
          "Queries.My",
          "Queries.View",
          "Queries.New",
          "Queries.Edit",
        ],
        currentRoute.id
      ),
      dataSources: includes(["DataSources.List"], currentRoute.id),
      alerts: includes(["Alerts.List", "Alerts.New", "Alerts.View", "Alerts.Edit"], currentRoute.id),
    }),
    [currentRoute.id]
  );
}

export default function DesktopNavbar() {
  const firstSettingsTab = first(settingsMenu.getAvailableItems());

  const activeState = useNavbarActiveState();

  const canCreateQuery = currentUser.hasPermission("create_query");
  const canCreateDashboard = currentUser.hasPermission("create_dashboard");
  const canCreateAlert = currentUser.hasPermission("list_alerts");

  return (
    <nav className="desktop-navbar" role="navigation">
      <NavbarSection className="desktop-navbar-logo">
        <div role="menuitem">
          <Link href="./" tabIndex={0}>
            <img src={logoUrl} alt="Redash" />
          </Link>
        </div>
      </NavbarSection>

      <NavbarSection>
        {currentUser.hasPermission("list_dashboards") && (
          <Menu.Item key="dashboards" role="menuitem" className={activeState.dashboards ? "navbar-active-item" : null}>
            <Link href="dashboards" tabIndex={0}>
              <DesktopOutlinedIcon alt="Dashboard navigation button" />
              <span className="desktop-navbar-label">Dashboards</span>
            </Link>
          </Menu.Item>
        )}
        {currentUser.hasPermission("view_query") && (
          <Menu.Item key="queries" role="menuitem" className={activeState.queries ? "navbar-active-item" : null}>
            <Link href="queries" tabIndex={0}>
              <CodeOutlinedIcon alt="Queries navigation button" />
              <span className="desktop-navbar-label">Queries</span>
            </Link>
          </Menu.Item>
        )}
        {currentUser.hasPermission("list_alerts") && (
          <Menu.Item key="alerts" role="menuitem" className={activeState.alerts ? "navbar-active-item" : null}>
            <Link href="alerts" tabIndex={0}>
              <AlertOutlinedIcon alt="Alerts navigation button" />
              <span className="desktop-navbar-label">Alerts</span>
            </Link>
          </Menu.Item>
        )}
      </NavbarSection>

      <NavbarSection className="desktop-navbar-spacer">
        {(canCreateQuery || canCreateDashboard || canCreateAlert) && (
          <Menu.SubMenu
            key="create"
            popupClassName="desktop-navbar-submenu"
            data-test="CreateButton"
            role="menuitem"
            tabIndex={0}
            title={
              <React.Fragment>
                <PlusOutlinedIcon />
                <span className="desktop-navbar-label">Create</span>
              </React.Fragment>
            }>
            {canCreateQuery && (
              <Menu.Item key="new-query" role="menuitem">
                <Link href="queries/new" tabIndex={0} data-test="CreateQueryMenuItem">
                  New Query
                </Link>
              </Menu.Item>
            )}
            {canCreateDashboard && (
              <Menu.Item key="new-dashboard" role="menuitem">
                <a
                  data-test="CreateDashboardMenuItem"
                  role="button"
                  tabIndex={0}
                  onMouseUp={() => CreateDashboardDialog.showModal()}>
                  New Dashboard
                </a>
              </Menu.Item>
            )}
            {canCreateAlert && (
              <Menu.Item key="new-alert" role="menuitem">
                <Link data-test="CreateAlertMenuItem" href="alerts/new" tabIndex={0}>
                  New Alert
                </Link>
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}
      </NavbarSection>

      <NavbarSection>
        <Menu.Item key="help" role="menuitem">
          <HelpTrigger showTooltip={false} type="HOME" tabIndex={0}>
            <QuestionCircleOutlinedIcon />
            <span className="desktop-navbar-label">Help</span>
          </HelpTrigger>
        </Menu.Item>
        {firstSettingsTab && (
          <Menu.Item key="settings" role="menuitem" className={activeState.dataSources ? "navbar-active-item" : null}>
            <Link href={firstSettingsTab.path} data-test="SettingsLink" tabIndex={0}>
              <SettingOutlinedIcon />
              <span className="desktop-navbar-label">Settings</span>
            </Link>
          </Menu.Item>
        )}
      </NavbarSection>

      <NavbarSection className="desktop-navbar-profile-menu">
        <Menu.SubMenu
          key="profile"
          popupClassName="desktop-navbar-submenu"
          role="menuitem"
          tabIndex={0}
          title={
            <span data-test="ProfileDropdown" className="desktop-navbar-profile-menu-title">
              <img className="profile__image_thumb" src={currentUser.profile_image_url} alt={currentUser.name} />
            </span>
          }>
          <Menu.Item key="profile" role="menuitem">
            <Link href="users/me" tabIndex={0}>
              Profile
            </Link>
          </Menu.Item>
          {currentUser.hasPermission("super_admin") && (
            <Menu.Item key="status" role="menuitem">
              <Link href="admin/status" tabIndex={0}>
                System Status
              </Link>
            </Menu.Item>
          )}
          <Menu.Divider />
          <Menu.Item key="logout" role="menuitem">
            <a data-test="LogOutButton" role="button" tabIndex={0} onClick={() => Auth.logout()}>
              Log out
            </a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="version" role="presentation" disabled className="version-info">
            <VersionInfo />
          </Menu.Item>
        </Menu.SubMenu>
      </NavbarSection>
    </nav>
  );
}