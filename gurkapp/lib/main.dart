import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'dart:typed_data';
import 'package:compressimage/compressimage.dart';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;

List<CameraDescription> cameras;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  cameras = await availableCameras();
  runApp(CameraApp());
}

class CameraApp extends StatefulWidget {
  @override
  _CameraAppState createState() => _CameraAppState();
}

class _CameraAppState extends State<CameraApp> with TickerProviderStateMixin {
  CameraController controller;
  AnimationController rotationController;

  @override
  void initState() {
    super.initState();
    rotationController = AnimationController(
      duration: Duration(milliseconds: 5000),
      vsync: this,
      upperBound: pi * 2,
    );
    rotationController.repeat();
    if (cameras.length > 0) {
      controller = CameraController(cameras[0], ResolutionPreset.veryHigh);
      controller.initialize().then((_) async {
        if (!mounted) {
          return;
        }
        setState(() {});
        await Future.delayed(Duration(minutes: 5));
        takeAndUploadPicture();
      });
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  void takeAndUploadPicture() async {
    String path = join(
      (await getTemporaryDirectory()).path,
      '${DateTime.now()}.png',
    );
    await controller.takePicture(path);
    await CompressImage.compress(imageSrc: path, desiredQuality: 80);

    Uint8List bytes = File(path).readAsBytesSync();

    var url = 'https://gurkapi.sebastianandreasson.com/gurkor';
    try {
      await http.post(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({'data': base64Encode(bytes)}),
      );
    } catch (e) {}
    await Future.delayed(Duration(minutes: 15));
    takeAndUploadPicture();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gurka',
      theme: ThemeData(
        primarySwatch: Colors.green,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: Scaffold(
        appBar: AppBar(title: Text('Gurkor')),
        body: _body(context),
      ),
    );
  }

  Widget _body(BuildContext context) {
    if (controller == null || !controller.value.isInitialized) {
      return Container(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Center(
              child: Text('aGurk'),
            )
          ],
        ),
      );
    }
    return Row(
      children: [
        Container(
          height: 400,
          width: 400,
          child: Center(
            child: AspectRatio(
              aspectRatio: controller.value.aspectRatio,
              child: CameraPreview(controller),
            ),
          ),
        ),
        Container(
          child: Center(
            child: RotationTransition(
              turns: Tween(begin: 0.0, end: 1.0).animate(rotationController),
              child: Container(
                padding: const EdgeInsets.all(8.0),
                child: const Text(
                  '🥒!',
                  style: TextStyle(fontSize: 50),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
