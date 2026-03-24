import marinaBay from "../../assets/circuits/marina-bay.svg";
import silverstone from "../../assets/circuits/silverstone.svg";
import suzuka from "../../assets/circuits/suzuka.svg";
import interlagos from "../../assets/circuits/interlagos.svg";
import monza from "../../assets/circuits/monza.svg";
import monaco from "../../assets/circuits/monaco.svg";
import bahrain from "../../assets/circuits/bahrain.svg";
import melbourne from "../../assets/circuits/melbourne.svg";
import spa from "../../assets/circuits/spa.svg";

import sg from "../../assets/flags/sg.png";
import gb from "../../assets/flags/gb.png";
import jp from "../../assets/flags/jp.png";
import br from "../../assets/flags/br.png";
import it from "../../assets/flags/it.png";
import mc from "../../assets/flags/mc.png";
import bh from "../../assets/flags/bh.png";
import au from "../../assets/flags/au.png";
import be from "../../assets/flags/be.png";

export const CIRCUIT_TRACK_SVGS: Record<string, string> = {
  "first-response": marinaBay,
  "reliability-run": silverstone,
  "cluster-control": suzuka,
  "signal-hunt": interlagos,
  "root-cause-run": monza,
  "terrain-recon": monaco,
  "operator-readiness": bahrain,
  "ground-zero": melbourne,
  "insight": spa,
};

export const CIRCUIT_FLAGS: Record<string, string> = {
  "first-response": sg,
  "reliability-run": gb,
  "cluster-control": jp,
  "signal-hunt": br,
  "root-cause-run": it,
  "terrain-recon": mc,
  "operator-readiness": bh,
  "ground-zero": au,
  "insight": be,
};
