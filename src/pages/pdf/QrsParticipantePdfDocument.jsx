import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  body: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 35,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  name: {
    fontSize: 8,
    textTransform: "uppercase",
    paddingLeft: "5pt",
    paddingRight: "5pt",
  },
  image: {
    width: "100pt",
    height: "100pt",
  },
  participante:{
    border: "1pt",
    borderColor: "black",
    width: "113pt",
    height: "120pt",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginRight: 0,
  }
});

QrsParticipantePdfDocument.propTypes = {
    participantes: PropTypes.array.isRequired
};

export default function QrsParticipantePdfDocument({participantes}){
  return(<Document>
    <Page size="A4" style={styles.body} wrap>
      {participantes?.map((participante)=>{
        return(<View key={"participante-"+participante.id} style={styles.participante}>
          <Image
            style={styles.image}
            src={participante.qrHash}
          />
          <Text style={styles.name}>{"#"+participante.n+" - "+participante.name}</Text>
        </View>);
      })}
    </Page>
  </Document>);
}