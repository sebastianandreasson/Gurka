import 'dart:async';
import 'dart:convert';
import 'dart:io';
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

class _CameraAppState extends State<CameraApp> {
  CameraController controller;

  @override
  void initState() {
    super.initState();
    if (cameras.length > 0) {
      controller = CameraController(cameras[0], ResolutionPreset.medium);
      controller.initialize().then((_) async {
        if (!mounted) {
          return;
        }
        setState(() {});
        await Future.delayed(Duration(seconds: 5));
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
    await CompressImage.compress(imageSrc: path, desiredQuality: 75);

    Uint8List bytes = File(path).readAsBytesSync();

    var url = 'http://192.168.0.32:4000/gurkor';
    var response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({'data': base64Encode(bytes)}),
    );
    await Future.delayed(Duration(seconds: 5));
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
        appBar: AppBar(title: Text('Gurka')),
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
    return AspectRatio(
      aspectRatio: controller.value.aspectRatio,
      child: CameraPreview(controller),
    );
  }
}
