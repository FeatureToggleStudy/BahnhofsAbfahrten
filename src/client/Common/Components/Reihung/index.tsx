import cc from 'clsx';
import Explain from './Explain';
import Gruppe from './Gruppe';
import Loading from 'Common/Components/Loading';
import React, { useEffect } from 'react';
import ReihungContainer from 'Common/container/ReihungContainer';
import Sektor from './Sektor';
import stopPropagation from 'Common/stopPropagation';
import useStyles from './index.style';

type Props = {
  className?: string;
  useZoom?: boolean;
  fahrzeugGruppe?: boolean;
  trainNumber: string;
  currentStation: string;
  scheduledDeparture: number;
  loadHidden?: boolean;
  showUIC?: boolean;
};

const Reihung = (props: Props) => {
  const {
    className,
    currentStation,
    fahrzeugGruppe = false,
    showUIC = false,
    scheduledDeparture,
    trainNumber,
    useZoom,
    loadHidden,
  } = props;
  const {
    reihungen,
    getReihung,
    auslastungen,
  } = ReihungContainer.useContainer();
  const reihung = reihungen[trainNumber + currentStation + scheduledDeparture];
  const combinedAuslastung =
    auslastungen[trainNumber + currentStation + scheduledDeparture];
  const auslastung = combinedAuslastung && combinedAuslastung.auslastung;
  const position = combinedAuslastung && combinedAuslastung.position;
  const classes = useStyles({
    reihung,
    auslastung,
    fahrzeugGruppe,
    showUIC,
  });

  useEffect(() => {
    if (reihung === undefined) {
      getReihung(trainNumber, currentStation, scheduledDeparture);
    }
  }, [currentStation, getReihung, reihung, scheduledDeparture, trainNumber]);

  if (reihung === null || (!reihung && loadHidden)) {
    return null;
  }
  if (reihung === undefined) {
    return <Loading type={1} />;
  }

  const correctLeft = useZoom ? reihung.startPercentage : 0;
  const scale = useZoom ? reihung.scale : 1;
  const differentZugnummer = reihung.differentZugnummer;

  return (
    <div className={cc(classes.wrap, className)} data-testid="reihung">
      <div className={classes.main}>
        <div className={classes.sektoren}>
          {reihung.halt.allSektor.map(s => (
            <Sektor
              correctLeft={correctLeft}
              scale={scale}
              key={s.sektorbezeichnung}
              sektor={s}
            />
          ))}
        </div>
        <div className={classes.reihung}>
          {reihung.allFahrzeuggruppe.map(g => (
            <Gruppe
              auslastung={auslastung}
              showGruppenZugnummer={differentZugnummer}
              showUIC={showUIC}
              originalTrainNumber={trainNumber}
              showFahrzeugGruppe={fahrzeugGruppe}
              correctLeft={correctLeft}
              scale={scale}
              type={reihung.zuggattung}
              showDestination={reihung.differentDestination}
              key={g.fahrzeuggruppebezeichnung}
              gruppe={g}
            />
          ))}
        </div>
        <Explain />
        {position && position.trainPosition && position.trainPosition.position && (
          <>
            <a
              onClick={stopPropagation}
              className={classes.position}
              href={`https://www.google.com/maps/search/?api=1&query=${position.trainPosition.position.latitude},${position.trainPosition.position.longitude}&zoom=10`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Position
            </a>
            <span className={classes.speed}>
              {position.trainPosition.speed}km/h
            </span>
          </>
        )}
        <span className={classes.richtung} />
      </div>
    </div>
  );
};

export default Reihung;
