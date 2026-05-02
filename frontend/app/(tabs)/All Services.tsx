// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import React from "react";
// import { router } from "expo-router";
// import Svg, { Path, Circle, Rect } from "react-native-svg";

// const { width } = Dimensions.get("window");

// // 🎨 SAME COLORS
// const C = {
//   navy: "#081F5C",
//   navyLight: "#081F5C14",
//   sky: "#BAD6EB",
//   cream: "#F7F2EB",
//   creamBorder: "#E8E2D8",
//   white: "#FFFFFF",
//   success: "#166534",
//   successBg: "#F0FDF4",
// };

// // 📦 SAME DATA
// const SERVICES = [
//   { title: "Electrician", sub: "Wiring & repairs", tag: "In demand" },
//   { title: "Plumber", sub: "Pipes & leaks" },
//   { title: "AC Repair", sub: "Cooling systems", tag: "In demand" },
//   { title: "Deep Cleaning", sub: "Full home clean" },
//   { title: "Carpenter", sub: "Wood & furniture" },
//   { title: "Painter", sub: "Interior & exterior" },
//   { title: "Pest Control", sub: "All pests covered" },
//   { title: "Moving/Transport", sub: "Packing & shifting" },
// ];

// // ✅ SAME ICONS (COPY EXACT)
// const ZapIcon   = () => <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" stroke={C.navy} strokeWidth={1.4} /></Svg>;
// const ToolIcon  = () => <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M14.7 3.3a3.5 3.5 0 00-4.9 4.9L3 15l2 2 6.8-6.8" stroke={C.navy} strokeWidth={1.4} /></Svg>;
// const WindIcon  = () => <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M2 12h18" stroke={C.navy} strokeWidth={1.4} /></Svg>;
// const BrushIcon = () => <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M18 2L9 11" stroke={C.navy} strokeWidth={1.4} /></Svg>;
// const ShieldIcon = () => <Svg width={20} height={20}><Path d="M12 22s8-4 8-10" stroke={C.navy} strokeWidth={1.4} /></Svg>;
// const TruckIcon = () => <Svg width={20} height={20}><Rect x={1} y={3} width={15} height={13} stroke={C.navy} strokeWidth={1.4} /></Svg>;
// const HammerIcon = () => <Svg width={20} height={20}><Path d="M15 2l7 7" stroke={C.navy} strokeWidth={1.4} /></Svg>;
// const StarIcon  = () => <Svg width={20} height={20}><Path d="M12 2v2" stroke={C.navy} strokeWidth={1.4} /></Svg>;

// const SERVICE_ICONS: any = {
//   Electrician: <ZapIcon />,
//   Plumber: <ToolIcon />,
//   "AC Repair": <WindIcon />,
//   "Deep Cleaning": <StarIcon />,
//   Carpenter: <HammerIcon />,
//   Painter: <BrushIcon />,
//   "Pest Control": <ShieldIcon />,
//   "Moving/Transport": <TruckIcon />,
// };

// // ✅ SAME CARD UI
// function ServiceCard({ service }: any) {
//   return (
//     <TouchableOpacity
//       style={styles.serviceCard}
//       onPress={() =>
//         router.push({
//           pathname: "/customer/service-list",
//           params: { service: service.title },
//         })
//       }
//     >
//       <View style={styles.serviceIconBox}>
//         {SERVICE_ICONS[service.title]}
//       </View>

//       <Text style={styles.serviceTitle}>{service.title}</Text>
//       <Text style={styles.serviceSub}>{service.sub}</Text>

//       {!!service.tag && (
//         <View style={styles.serviceTag}>
//           <Text style={styles.serviceTagText}>{service.tag}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// }

// // 🏠 SCREEN
// export default function ServicesScreen() {
//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.cream} />

//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>All Services</Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.grid}>
//           {SERVICES.map((s) => (
//             <ServiceCard key={s.title} service={s} />
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // 📐 SAME GRID
// const CARD_WIDTH = (width - 20 * 2 - 10) / 2;

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.cream },

//   header: {
//     paddingTop: 60,
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//   },

//   headerTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: C.navy,
//   },

//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     paddingHorizontal: 20,
//     gap: 10,
//   },

//   serviceCard: {
//     width: CARD_WIDTH,
//     backgroundColor: C.white,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: C.creamBorder,
//     padding: 14,
//   },

//   serviceIconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: C.navyLight,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//   },

//   serviceTitle: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: C.navy,
//   },

//   serviceSub: {
//     fontSize: 10,
//     color: C.navy,
//     opacity: 0.4,
//   },

//   serviceTag: {
//     backgroundColor: C.successBg,
//     borderRadius: 6,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     marginTop: 6,
//   },

//   serviceTagText: {
//     fontSize: 9,
//     color: C.success,
//     fontWeight: "600",
//   },
    // });
    import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import Svg, { Path, Rect } from "react-native-svg";

const { width } = Dimensions.get("window");

const C = {
  navy: "#081F5C",
  navyLight: "#081F5C14",
  cream: "#F7F2EB",
  creamBorder: "#E8E2D8",
  white: "#FFFFFF",
  success: "#166534",
  successBg: "#F0FDF4",
};

// ICON WRAP
const IconBox = ({ children }: any) => (
  <View style={styles.iconBox}>{children}</View>
);

// SAME ICONS
const ICONS: any = {
  Electrician: <IconBox><Svg width={20} height={20}><Path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
  Plumber: <IconBox><Svg width={20} height={20}><Path d="M14 3l7 7-6 6-7-7z" stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
  "AC Repair": <IconBox><Svg width={20} height={20}><Path d="M2 12h20M6 6h12M6 18h12" stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
  "Deep Cleaning": <IconBox><Svg width={20} height={20}><Path d="M12 2v4M12 18v4M4 12h4M16 12h4" stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
  Carpenter: <IconBox><Svg width={20} height={20}><Path d="M3 21l9-9M14 3l7 7" stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
  Painter: <IconBox><Svg width={20} height={20}><Path d="M18 2L9 11" stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
  "Pest Control": <IconBox><Svg width={20} height={20}><Path d="M12 22s8-4 8-10-8-10-8-10-8 4-8 10 8 10 8 10z" stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
  "Moving/Transport": <IconBox><Svg width={20} height={20}><Rect x={2} y={6} width={12} height={10} stroke={C.navy} strokeWidth={1.5}/></Svg></IconBox>,
};

const SERVICES = [
  { title: "Electrician", sub: "Wiring & repairs", tag: "In demand" },
  { title: "Plumber", sub: "Pipes & leaks" },
  { title: "AC Repair", sub: "Cooling systems", tag: "In demand" },
  { title: "Deep Cleaning", sub: "Full home clean" },
  { title: "Carpenter", sub: "Wood & furniture" },
  { title: "Painter", sub: "Interior & exterior" },
  { title: "Pest Control", sub: "All pests covered" },
  { title: "Moving/Transport", sub: "Packing & shifting" },
];

function Card({ item }: any) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/customer/service-list",
          params: { service: item.title },
        })
      }
    >
      {ICONS[item.title]}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.sub}>{item.sub}</Text>

      {item.tag && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function Services() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.cream} />

      <Text style={styles.header}>All Services</Text>

      <ScrollView>
        <View style={styles.grid}>
          {SERVICES.map((s) => (
            <Card key={s.title} item={s} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  header: { fontSize: 22, fontWeight: "700", margin: 20, color: C.navy },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  card: {
    width: (width - 50) / 2,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.creamBorder,
    padding: 14,
    marginBottom: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.navyLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  title: { fontWeight: "700", fontSize: 13, color: C.navy },
  sub: { fontSize: 10, opacity: 0.4, color: C.navy },

  tag: {
    backgroundColor: C.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },

  tagText: { fontSize: 9, color: C.success },
});