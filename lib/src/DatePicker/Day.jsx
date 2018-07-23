import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import { fade } from '@material-ui/core/styles/colorManipulator';

class Day extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    current: PropTypes.bool,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    selected: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    hidden: false,
    current: false,
    selected: false,
  }

  render() {
    const {
      children, classes, disabled, hidden, current, selected,
      prelighted, highlighted, leftCap, rightCap, ...other
    } = this.props;

    const className = classnames(classes.day, {
      [classes.hidden]: hidden,
      [classes.current]: current,
      [classes.selected]: selected || highlighted,
      [classes.disabled]: disabled,
    });

    const icon = (
      <IconButton
        className={className}
        tabIndex={hidden || disabled ? -1 : 0}
        {...other}
      >
        <span> {children} </span>
      </IconButton>
    );

    if (highlighted || prelighted) {
      return (
        <div className={classnames({
          [classes.leftCap]: leftCap,
          [classes.rightCap]: rightCap,
          [classes.prelighted]: prelighted,
          [classes.highlighted]: highlighted,
        })}>
          {icon}
        </div>
      );
    } else {
      return icon;
    }
  }
}

const styles = theme => ({
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  current: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  selected: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  disabled: {
    pointerEvents: 'none',
    color: theme.palette.text.hint,
  },
  prelighted: {
    backgroundColor: fade(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  highlighted: {
    backgroundColor: theme.palette.primary.main,
  },
  leftCap: {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  rightCap: {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
});

export default withStyles(styles, { name: 'MuiPickersDay' })(Day);
