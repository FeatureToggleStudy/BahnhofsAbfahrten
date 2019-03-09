// @flow
import './Fahrzeug.scss';
import ActionAccessible from '@material-ui/icons/Accessible';
import ActionMotorcycle from '@material-ui/icons/Motorcycle';
import cc from 'classnames';
import MapsLocalDining from '@material-ui/icons/LocalDining';
import React from 'react';
import type { Fahrzeug, FahrzeugType, SpecificType } from 'types/reihung';

export type InheritedProps = {
  specificType: ?SpecificType,
  type: FahrzeugType,
  scale: number,
  correctLeft: number,
};

type Props = InheritedProps & {
  +fahrzeug: Fahrzeug,
  +destination: ?string,
  +wrongWing: boolean,
};

// Klasse: 0 = unknown
// Klasse: 1 = Nur erste
// Klasse: 2 = Nur zweite
// Klasse: 3 = 1 & 2
// klasse: 4 = Nicht für Passagiere. z.B. Triebkopf
type AdditionalFahrzeugInfos = {
  klasse: 0 | 1 | 2 | 3 | 4,
  speise: boolean,
  rollstuhl: boolean,
  fahrrad: boolean,
  comfort: boolean,
};

const comfort = [
  {
    ICE1: ['11'],
    ICE2: ['26', '36'],
    ICE3: ['28', '38'],
    ICE3V: ['26', '36'],
    ICE4: ['11'],
    ICET411: ['28', '38'],
    ICET415: ['28', '38'],
    IC2: ['5'],
    MET: ['6'],
  },
  {
    ICE1: ['7'],
    ICE2: ['23', '33'],
    ICE3: ['27', '37'],
    ICE3V: ['25', '35'],
    ICE4: ['7'],
    ICET411: ['27', '37'],
    ICET415: ['23', '33'],
    IC2: ['4'],
    MET: ['5'],
  },
];

const comfortICRegexp = [/Avmm?z$/, /Bvmm?sz|Bimm?z$/];

function comfortLogic(fahrzeug: Fahrzeug, klasse: number, type: FahrzeugType, specificType: ?SpecificType) {
  const klasseIndex = klasse - 1;
  const comfortSeats: ?(string[]) = specificType && comfort[klasseIndex]?.[specificType];

  if (comfortSeats) {
    return comfortSeats.includes(fahrzeug.wagenordnungsnummer);
  } else if (type === 'IC') {
    if (fahrzeug.wagenordnungsnummer === '12' && fahrzeug.fahrzeugtyp.match(comfortICRegexp[klasseIndex])) {
      return true;
    } else if (fahrzeug.wagenordnungsnummer === '10' && fahrzeug.fahrzeugtyp.match(comfortICRegexp[klasseIndex])) {
      return true;
    }
  }

  return false;
}

function getFahrzeugInfo(fahrzeug: Fahrzeug, type: FahrzeugType, specificType: ?SpecificType): AdditionalFahrzeugInfos {
  const data: AdditionalFahrzeugInfos = {
    klasse: 0,
    speise: Boolean(fahrzeug.allFahrzeugausstattung.find(a => a.ausstattungsart === 'BISTRO')),
    rollstuhl: Boolean(fahrzeug.allFahrzeugausstattung.find(a => a.ausstattungsart === 'PLAETZEROLLSTUHL')),
    fahrrad: Boolean(fahrzeug.allFahrzeugausstattung.find(a => a.ausstattungsart === 'PLAETZEFAHRRAD')),
    comfort: false,
  };

  switch (fahrzeug.kategorie) {
    case 'DOPPELSTOCKSTEUERWAGENZWEITEKLASSE':
    case 'DOPPELSTOCKWAGENZWEITEKLASSE':
    case 'REISEZUGWAGENZWEITEKLASSE':
    case 'STEUERWAGENZWEITEKLASSE':
      data.klasse = 2;
      break;
    case 'HALBSPEISEWAGENZWEITEKLASSE':
    case 'SPEISEWAGEN':
      data.klasse = 2;
      data.speise = true;
      break;
    default:
      break;
    case 'STEUERWAGENERSTEZWEITEKLASSE':
    case 'REISEZUGWAGENERSTEZWEITEKLASSE':
      data.klasse = 3;
      break;
    case 'HALBSPEISEWAGENERSTEKLASSE':
      data.klasse = 1;
      data.speise = true;
      break;
    case 'DOPPELSTOCKWAGENERSTEKLASSE':
    case 'REISEZUGWAGENERSTEKLASSE':
    case 'STEUERWAGENERSTEKLASSE':
      data.klasse = 1;
      break;
    case 'TRIEBKOPF':
    case 'LOK':
      data.klasse = 4;
  }

  data.comfort = comfortLogic(fahrzeug, data.klasse, type, specificType);

  return data;
}

const FahrzeugComp = ({ fahrzeug, type, specificType, scale, correctLeft, wrongWing }: Props) => {
  const { startprozent, endeprozent } = fahrzeug.positionamhalt;

  const start = Number.parseInt(startprozent, 10);
  const end = Number.parseInt(endeprozent, 10);

  const pos = {
    left: `${(start - correctLeft) * scale}%`,
    width: `${(end - start) * scale}%`,
  };
  const info = getFahrzeugInfo(fahrzeug, type, specificType);

  return (
    <div
      style={pos}
      className={cc([
        'Fahrzeug',
        {
          'Fahrzeug--closed': fahrzeug.status === 'GESCHLOSSEN',
          wrongWing,
        },
      ])}
    >
      <span className={`Fahrzeug__klasse Fahrzeug__klasse--${info.klasse}`} />
      <span className="Fahrzeug__nummer">{fahrzeug.wagenordnungsnummer}</span>
      {info.rollstuhl && <ActionAccessible className="Fahrzeug--icon" />}
      {info.fahrrad && <ActionMotorcycle className="Fahrzeug--icon" />}
      {info.speise && <MapsLocalDining className="Fahrzeug--icon" />}
      {info.comfort && <span className="Fahrzeug--comfort" />}
      <span className="Fahrzeug--type">{fahrzeug.fahrzeugtyp}</span>
      {/* {destination && <span className="Fahrzeug--destination">{destination}</span>} */}
    </div>
  );
};

export default React.memo<Props>(FahrzeugComp);
