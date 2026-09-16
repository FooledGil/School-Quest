import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;

  ApiException(this.message, {this.statusCode, this.errors});

  @override
  String toString() => message;
}

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  String? _token;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    final savedBaseUrl = prefs.getString('custom_base_url');
    if (savedBaseUrl != null && savedBaseUrl.isNotEmpty) {
      ApiConstants.baseUrl = savedBaseUrl;
      ApiConstants.storageBaseUrl = savedBaseUrl.replaceAll('/api', '');
    }
  }

  Future<void> setToken(String? token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    if (token != null) {
      await prefs.setString('auth_token', token);
    } else {
      await prefs.remove('auth_token');
    }
  }

  Future<void> setCustomBaseUrl(String url) async {
    ApiConstants.baseUrl = url;
    ApiConstants.storageBaseUrl = url.replaceAll('/api', '');
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('custom_base_url', url);
  }

  String? get token => _token;
  bool get isAuthenticated => _token != null && _token!.isNotEmpty;

  Map<String, String> _headers() {
    final headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (_token != null && _token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  Future<dynamic> get(String endpoint) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    try {
      final response = await http.get(uri, headers: _headers());
      return _handleResponse(response);
    } catch (e) {
      _handleNetworkError(e);
    }
  }

  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    try {
      final response = await http.post(
        uri,
        headers: _headers(),
        body: body != null ? jsonEncode(body) : null,
      );
      return _handleResponse(response);
    } catch (e) {
      _handleNetworkError(e);
    }
  }

  Future<dynamic> put(String endpoint, {Map<String, dynamic>? body}) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    try {
      final response = await http.put(
        uri,
        headers: _headers(),
        body: body != null ? jsonEncode(body) : null,
      );
      return _handleResponse(response);
    } catch (e) {
      _handleNetworkError(e);
    }
  }

  Future<dynamic> delete(String endpoint) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    try {
      final response = await http.delete(uri, headers: _headers());
      return _handleResponse(response);
    } catch (e) {
      _handleNetworkError(e);
    }
  }

  /// Upload file multipart (e.g. proof image or avatar photo)
  Future<dynamic> multipart(
    String endpoint, {
    Map<String, String>? fields,
    String? fileField,
    File? file,
  }) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    try {
      final request = http.MultipartRequest('POST', uri);

      final headers = _headers();
      headers.remove('Content-Type'); // Let http set multipart boundary
      request.headers.addAll(headers);

      if (fields != null) {
        request.fields.addAll(fields);
      }

      if (fileField != null && file != null && await file.exists()) {
        final filename = file.path.split('/').last;
        final ext = filename.split('.').last.toLowerCase();
        final contentType = ext == 'png'
            ? MediaType('image', 'png')
            : (ext == 'webp' ? MediaType('image', 'webp') : MediaType('image', 'jpeg'));

        request.files.add(await http.MultipartFile.fromPath(
          fileField,
          file.path,
          contentType: contentType,
        ));
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      return _handleResponse(response);
    } catch (e) {
      _handleNetworkError(e);
    }
  }

  dynamic _handleResponse(http.Response response) {
    dynamic body;
    try {
      body = jsonDecode(response.body);
    } catch (_) {
      body = null;
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    }

    String message = 'Terjadi kesalahan sistem (${response.statusCode})';
    Map<String, dynamic>? errors;

    if (body is Map<String, dynamic>) {
      if (body['message'] != null) {
        message = body['message'].toString();
      }
      if (body['errors'] is Map<String, dynamic>) {
        errors = body['errors'];
      }
    }

    throw ApiException(message, statusCode: response.statusCode, errors: errors);
  }

  void _handleNetworkError(dynamic error) {
    if (error is ApiException) throw error;
    if (error is SocketException) {
      throw ApiException('Tidak dapat terhubung ke server Laravel. Pastikan server sedang berjalan di ${ApiConstants.baseUrl}');
    }
    throw ApiException('Kesalahan jaringan: $error');
  }
}
