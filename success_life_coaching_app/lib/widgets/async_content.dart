import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/config/constants.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';

/// Loads data once, shows a spinner / error with retry, and supports pull-to-refresh.
class AsyncContent<T> extends StatefulWidget {
  final Future<T> Function() load;
  final Widget Function(BuildContext context, T data) builder;

  const AsyncContent({super.key, required this.load, required this.builder});

  @override
  State<AsyncContent<T>> createState() => _AsyncContentState<T>();
}

class _AsyncContentState<T> extends State<AsyncContent<T>> {
  late Future<T> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.load();
  }

  Future<void> _reload() async {
    final next = widget.load();
    setState(() => _future = next);
    try {
      await next;
    } catch (_) {
      // Error is shown by the FutureBuilder.
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<T>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.spacingLg),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.wifi_off, size: 48, color: AppConstants.textSecondaryColor),
                  const SizedBox(height: 12),
                  Text(context.tr('common.load_failed'),
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Text('${snapshot.error}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: AppConstants.textSecondaryColor)),
                  const SizedBox(height: 16),
                  ElevatedButton(onPressed: _reload, child: Text(context.tr('common.retry'))),
                ],
              ),
            ),
          );
        }
        return RefreshIndicator(
          onRefresh: _reload,
          color: AppConstants.primaryColor,
          child: widget.builder(context, snapshot.data as T),
        );
      },
    );
  }
}

/// Small green "eyebrow" + big headline + intro, like the website page headers.
class PageHeader extends StatelessWidget {
  final String? eyebrow;
  final String? headline;
  final String? intro;

  const PageHeader({super.key, this.eyebrow, this.headline, this.intro});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (eyebrow != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: AppConstants.primaryLight,
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: const Color(0xFFC3DEC5)),
            ),
            child: Text(
              eyebrow!.toUpperCase(),
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                color: AppConstants.secondaryColor,
              ),
            ),
          ),
        if (headline != null) ...[
          const SizedBox(height: 12),
          Text(
            headline!,
            style: const TextStyle(
              fontSize: 26,
              height: 1.25,
              fontWeight: FontWeight.w800,
              color: AppConstants.primaryColor,
            ),
          ),
        ],
        if (intro != null) ...[
          const SizedBox(height: 10),
          Text(
            intro!,
            style: const TextStyle(
              fontSize: 16,
              height: 1.6,
              color: AppConstants.textSecondaryColor,
            ),
          ),
        ],
      ],
    );
  }
}
