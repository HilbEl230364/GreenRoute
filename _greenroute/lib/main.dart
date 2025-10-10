import 'package:flutter/material.dart';
import 'UI/home_screen.dart';

void main() {
  runApp(GreenRouteApp());
}

class GreenRouteApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GreenRoute',
      home: HomeScreen(),
    );
  }
}