// @flow
import './FavList.scss';
import { Actions } from 'client/actions/abfahrten';
import { connect } from 'react-redux';
import { sortedFavValues } from 'client/selector/fav';
import FavEntry from './FavEntry';
import MostUsed from './MostUsed';
import React from 'react';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type DispatchProps = {|
  setCurrentStation: typeof Actions.setCurrentStation,
|};
type StateProps = {|
  favs: Station[],
|};
type Props = {|
  ...StateProps,
  ...DispatchProps,
|};

class FavList extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.setCurrentStation(null);
  }
  render() {
    const { favs } = this.props;

    return (
      <main className="FavList">
        {favs.length ? (
          favs.map(fav => fav && <FavEntry key={fav.id} fav={fav} />)
        ) : (
          <>
            <span className="FavEntry">Keine Favoriten</span>
            <span className="FavEntry">Oft gesucht:</span>
            <MostUsed />
          </>
        )}
      </main>
    );
  }
}

export default connect<AppState, Function, void, StateProps, DispatchProps>(
  state => ({
    favs: sortedFavValues(state),
  }),
  {
    setCurrentStation: Actions.setCurrentStation,
  }
)(FavList);
