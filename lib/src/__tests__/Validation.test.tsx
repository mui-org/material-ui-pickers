import * as React from 'react';
import { isWeekend } from 'date-fns';
import { TextField } from '@material-ui/core';
import { MaterialUiPickersDate } from '../typings/date';
import { DesktopDatePicker } from '../DatePicker/DatePicker';
import { mountPickerWithState, utilsToUse } from './test-utils';
import { TimePickerProps, DesktopTimePicker } from '../TimePicker/TimePicker';
import { DesktopDateRangePicker, DateRangeDelimiter } from '../DateRangePicker/DateRangePicker';

const disableWeekends = (date: MaterialUiPickersDate) => {
  return isWeekend(utilsToUse.toJsDate(date));
};

describe('DatePicker validation', () => {
  test.each`
    props                                     | input            | expectedError
    ${{}}                                     | ${'invalidText'} | ${'invalidDate'}
    ${{ disablePast: true }}                  | ${'01/01/1900'}  | ${'disablePast'}
    ${{ disableFuture: true }}                | ${'01/01/2050'}  | ${'disableFuture'}
    ${{ minDate: new Date('01/01/2000') }}    | ${'01/01/1990'}  | ${'minDate'}
    ${{ maxDate: new Date('01/01/2000') }}    | ${'01/01/2010'}  | ${'maxDate'}
    ${{ shouldDisableDate: disableWeekends }} | ${'04/25/2020'}  | ${'shouldDisableDate'}
  `('Should dispatch onError $expectedError', ({ props, input, expectedError }) => {
    if (process.env.UTILS === 'luxon') {
      return;
    }

    const onErrorMock = jest.fn();
    const component = mountPickerWithState(utilsToUse.date(), stateProps => (
      <DesktopDatePicker {...stateProps} {...props} onError={onErrorMock} />
    ));

    component.find('input').simulate('change', {
      target: {
        value: input,
      },
    });

    expect(onErrorMock).toBeCalledWith(expectedError, expect.anything());
  });

  test('It should properly annulate the error', () => {
    if (process.env.UTILS === 'luxon') {
      return;
    }

    const onErrorMock = jest.fn();
    const component = mountPickerWithState(utilsToUse.date(), stateProps => (
      <DesktopDatePicker {...stateProps} disablePast onError={onErrorMock} />
    ));

    component.find('input').simulate('change', {
      target: {
        value: '01/01/1900',
      },
    });

    expect(onErrorMock).toHaveBeenCalledWith('disablePast', expect.anything());

    component.find('input').simulate('change', {
      target: {
        value: '01/01/2099',
      },
    });

    expect(onErrorMock).toHaveBeenCalledWith(null, expect.anything());
  });
});

describe('TimePicker validation', () => {
  const createTime = (time: string) => new Date('01/01/2000 ' + time);
  const shouldDisableTime: TimePickerProps['shouldDisableTime'] = (value, _clockType) => {
    return value === 10;
  };

  test.each`
    props                               | input            | expectedError
    ${{}}                               | ${'invalidText'} | ${'invalidDate'}
    ${{ minTime: createTime('08:00') }} | ${'03:00'}       | ${'minTime'}
    ${{ maxTime: createTime('08:00') }} | ${'12:00'}       | ${'maxTime'}
    ${{ shouldDisableTime }}            | ${'10:00'}       | ${'shouldDisableTime-hours'}
    ${{ shouldDisableTime }}            | ${'00:10'}       | ${'shouldDisableTime-minutes'}
  `('TimePicker should dispatch onError $expectedError', ({ props, input, expectedError }) => {
    const onErrorMock = jest.fn();
    const component = mountPickerWithState(utilsToUse.date(), stateProps => (
      <DesktopTimePicker ampm={false} {...stateProps} {...props} onError={onErrorMock} />
    ));

    component.find('input').simulate('change', {
      target: {
        value: input,
      },
    });

    expect(onErrorMock).toBeCalledWith(expectedError, expect.anything());
  });
});

describe.skip.only('DateRangePicker validation', () => {
  test.each`
    props                                     | startInput       | endInput         | expectedError
    ${{}}                                     | ${'invalidText'} | ${''}            | ${[null, null]}
    ${{}}                                     | ${''}            | ${'invalidText'} | ${[null, null]}
    ${{}}                                     | ${'01/01/2020'}  | ${'01/01/1920'}  | ${['invalidRange', 'invalidRange']}
    ${{ disablePast: true }}                  | ${'01/01/1900'}  | ${'01/01/2020'}  | ${['disablePast', null]}
    ${{ disableFuture: true }}                | ${'01/01/2010'}  | ${'01/01/2050'}  | ${[null, 'disableFuture']}
    ${{ minDate: new Date('01/01/2000') }}    | ${'01/01/1990'}  | ${'01/01/1990'}  | ${['minDate', 'minDate']}
    ${{ maxDate: new Date('01/01/2000') }}    | ${'01/01/2010'}  | ${'01/01/2010'}  | ${['maxDate', 'maxDate']}
    ${{ shouldDisableDate: disableWeekends }} | ${'04/25/2020'}  | ${'06/25/2020'}  | ${['shouldDisableDate', null]}
  `('Should dispatch onError $expectedError', ({ props, startInput, endInput, expectedError }) => {
    if (process.env.UTILS === 'luxon') {
      return;
    }

    const onErrorMock = jest.fn();
    const component = mountPickerWithState([null, null], stateProps => (
      <DesktopDateRangePicker
        {...stateProps}
        {...props}
        onError={onErrorMock}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} />
            <TextField {...endProps} />
          </>
        )}
      />
    ));

    component
      .find('input')
      .at(0)
      .simulate('change', {
        target: {
          value: startInput,
        },
      });

    component
      .find('input')
      .at(1)
      .simulate('change', {
        target: {
          value: endInput,
        },
      })
      .simulate('blur');

    expect(onErrorMock).toBeCalledWith(expectedError, expect.anything());
  });
});
