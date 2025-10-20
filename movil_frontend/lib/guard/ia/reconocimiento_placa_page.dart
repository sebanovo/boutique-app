import 'package:flutter/material.dart';
import 'package:camera/camera.dart';

class ReconocimientoPlacaPage extends StatefulWidget {
  const ReconocimientoPlacaPage({super.key});

  @override
  State<ReconocimientoPlacaPage> createState() => _ReconocimientoPlacaPageState();
}

class _ReconocimientoPlacaPageState extends State<ReconocimientoPlacaPage> {
  CameraController? _controller;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _initCamera();
  }

  Future<void> _initCamera() async {
    final cameras = await availableCameras();
    final camera = cameras.first;
    _controller = CameraController(camera, ResolutionPreset.medium);
    await _controller!.initialize();
    if (mounted) setState(() {});
  }

  Future<void> _captureAndSend() async {
    if (_controller == null || !_controller!.value.isInitialized) return;
    setState(() => _loading = true);

    try {
      final picture = await _controller!.takePicture();

      // TODO: enviar `picture.path` al backend (POST reconocimiento de placa)
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Foto enviada para reconocimiento de placa")),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_controller == null || !_controller!.value.isInitialized) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      appBar: AppBar(title: const Text("Reconocimiento de Placa")),
      body: Stack(
        children: [
          CameraPreview(_controller!),
          if (_loading)
            const Center(
              child: CircularProgressIndicator(color: Colors.white),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _loading ? null : _captureAndSend,
        child: const Icon(Icons.camera_alt),
      ),
    );
  }
}
