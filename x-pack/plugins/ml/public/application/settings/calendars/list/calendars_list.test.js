/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { shallowWithIntl } from '@kbn/test-jest-helpers';
import { ml } from '../../../services/ml_api_service';

import { CalendarsList } from './calendars_list';

jest.mock('../../../components/help_menu', () => ({
  HelpMenu: () => <div id="mockHelpMenu" />,
}));

jest.mock('../../../util/dependency_cache', () => ({
  getDocLinks: () => ({
    links: {
      ml: { calendars: jest.fn() },
    },
  }),
}));

jest.mock('../../../capabilities/check_capabilities', () => ({
  checkPermission: () => true,
}));
jest.mock('../../../license', () => ({
  hasLicenseExpired: () => false,
  isFullLicense: () => false,
}));
jest.mock('../../../capabilities/get_capabilities', () => ({
  getCapabilities: () => {},
}));
jest.mock('../../../ml_nodes_check/check_ml_nodes', () => ({
  mlNodesAvailable: () => true,
}));
jest.mock('../../../services/ml_api_service', () => ({
  ml: {
    calendars: () => {
      return Promise.resolve([]);
    },
    delete: jest.fn(),
  },
}));

jest.mock('react', () => {
  const r = jest.requireActual('react');
  return { ...r, memo: (x) => x };
});

jest.mock('@kbn/kibana-react-plugin/public', () => ({
  withKibana: (node) => {
    return node;
  },
  reactToUiComponent: jest.fn(),
}));

const testingState = {
  loading: false,
  calendars: [
    {
      calendar_id: 'farequote-calendar',
      job_ids: ['farequote'],
      description: 'test ',
      events: [
        {
          description: 'Downtime feb 9 2017 10:10 to 10:30',
          start_time: 1486656600000,
          end_time: 1486657800000,
          calendar_id: 'farequote-calendar',
          event_id: 'Ee-YgGcBxHgQWEhCO_xj',
        },
      ],
    },
    {
      calendar_id: 'this-is-a-new-calendar',
      job_ids: ['test'],
      description: 'new calendar',
      events: [
        {
          description: 'New event!',
          start_time: 1544076000000,
          end_time: 1544162400000,
          calendar_id: 'this-is-a-new-calendar',
          event_id: 'ehWKhGcBqHkXuWNrIrSV',
        },
      ],
    },
  ],
  isDestroyModalVisible: false,
  calendarId: null,
  selectedForDeletion: [],
  nodesAvailable: true,
};

const props = {
  canCreateCalendar: true,
  canDeleteCalendar: true,
  kibana: {
    services: {
      data: {
        query: {
          timefilter: {
            timefilter: {
              disableTimeRangeSelector: jest.fn(),
              disableAutoRefreshSelector: jest.fn(),
            },
          },
        },
      },
      notifications: {
        toasts: {
          addDanger: () => {},
        },
      },
    },
  },
};

describe('CalendarsList', () => {
  test('loads calendars on mount', () => {
    ml.calendars = jest.fn(() => []);
    shallowWithIntl(<CalendarsList {...props} />);

    expect(ml.calendars).toHaveBeenCalled();
  });

  test('Renders calendar list with calendars', () => {
    const wrapper = shallowWithIntl(<CalendarsList {...props} />);
    wrapper.instance().setState(testingState);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
