import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { I18nService } from "core-app/core/i18n/i18n.service";
import { arrayUpdate } from "@datorama/akita";
import { NotificationSetting } from "core-app/features/user-preferences/state/notification-setting.model";
import { UserPreferencesStore } from "core-app/features/user-preferences/state/user-preferences.store";

@Component({
  selector: '[op-notification-setting-row]',
  templateUrl: './notification-setting-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSettingRowComponent implements OnInit {
  @Input() first = false;
  @Input() setting:NotificationSetting;

  /** Whether this setting is global */
  global = false;

  text = {
    title: this.I18n.t('js.notifications.settings.title'),
    save: this.I18n.t('js.button_save'),
    email: this.I18n.t('js.notifications.email'),
    inApp: this.I18n.t('js.notifications.in_app'),
    remove_all: this.I18n.t('js.notifications.settings.remove_all'),
    involved_header: 'I am involved',
    mentioned_header: 'I was mentioned',
    watched_header: 'I am watching',
    any_event_header: 'All events',
    default_all_projects: 'Default for all projects',
    add_setting: 'Add settings for project',
    channel: (channel:string):string => this.I18n.t('js.notifications.channels.' + channel)
  };

  constructor(
    private I18n:I18nService,
    private store:UserPreferencesStore,
  ) {
  }

  ngOnInit() {
    this.global = this.setting._links.project.href === null;
  }

  remove():void {
    this.store.update(
      ({ notifications }) => ({
        notifications: notifications.filter(notification =>
          notification._links.project.href !== this.setting._links.project.href)
      })
    );
  }

  update(delta:Partial<NotificationSetting>) {
    this.store.update(
      ({ notifications }) => ({
        notifications: arrayUpdate(
          notifications, this.matcherFn.bind(this), delta
        )
      })
    );
  }

  private matcherFn(notification:NotificationSetting) {
    return notification._links.project.href === this.setting._links.project.href &&
      notification.channel === this.setting.channel;
  }
}
