import { isHbf } from './index';
import { Link } from 'react-router-dom';
import { Train } from 'types/abfahrten';
import cc from 'classnames';
import React, { ReactNode, useMemo } from 'react';
import stopPropagation from 'Common/stopPropagation';
import useStyles from './index.style';

interface Props {
  stops: Train[];
}
const DetailVia = ({ stops }: Props) => {
  const classes = useStyles();

  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];

    stops.forEach((s, i) => {
      stopsToRender.push(
        <Link
          key={i}
          onClick={stopPropagation}
          to={{
            pathname: encodeURIComponent(s.name),
            state: { searchType: 'stationsData' },
          }}
          title={`Zugabfahrten für ${s.name}`}
          className={cc({
            [classes.cancelled]: s.isCancelled,
            [classes.additional]: s.isAdditional,
            [classes.hbf]: isHbf(s),
          })}
        >
          {s.name}
        </Link>
      );
      if (i + 1 !== stops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [classes, stops]);

  return <>{stopsToRender}</>;
};

export default DetailVia;
