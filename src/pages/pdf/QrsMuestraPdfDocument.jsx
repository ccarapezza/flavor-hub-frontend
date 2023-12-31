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
  id: {
    fontSize: 12,
    textTransform: "uppercase"
  },
  image: {
    width: "100pt",
    height: "100pt",
  },
  muestra:{
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

QrsMuestraPdfDocument.propTypes = {
    muestras: PropTypes.array.isRequired
};

export default function QrsMuestraPdfDocument({muestras}){
  return(<Document>
    <Page size="A4" style={styles.body} wrap>
      {muestras?.map((muestra)=>{
        return(<View key={"muestra-"+muestra.id} style={styles.muestra}>
          <Image
            style={styles.image}
            src={muestra.qrHash}
          />
          <Text style={styles.id}>{"#"+muestra.n}</Text>
        </View>);
      })}
    </Page>
  </Document>);
}