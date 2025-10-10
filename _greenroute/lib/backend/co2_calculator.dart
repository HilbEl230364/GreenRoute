class Co2Calculator {
  // Dummy-Funktion: berechnet CO2-Ersparnis
  static double calculate(double distanceKm, String transportMode) {
    switch (transportMode) {
      case 'Fahrrad':
        return 0.0; // Fahrrad produziert kein CO2
      case 'ÖPNV':
        return distanceKm * 0.05; // Beispiel: 50 g pro km
      case 'Auto':
        return distanceKm * 0.2; // Beispiel: 200 g pro km
      default:
        return 0.0;
    }
  }
}