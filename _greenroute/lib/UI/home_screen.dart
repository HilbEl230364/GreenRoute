import 'package:flutter/material.dart';
import '../backend/co2_calculator.dart';
import '../backend/route_service.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Dummy-Daten
    String start = "Schule";
    String ziel = "Park";
    String transport = "Fahrrad";
    double distance = 5.0;

    double co2 = Co2Calculator.calculate(distance, transport);
    List<String> route = RouteService.getRoute(start, ziel);

    return Scaffold(
      appBar: AppBar(title: Text('GreenRoute')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Route von $start nach $ziel', style: TextStyle(fontSize: 20)),
            SizedBox(height: 10),
            Text('Transport: $transport'),
            Text('CO₂ gespart: ${co2.toStringAsFixed(2)} kg'),
            SizedBox(height: 20),
            Text('Zwischenstopps:'),
            for (var stop in route) Text('- $stop'),
          ],
        ),
      ),
    );
  }
}