import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/models/course_model.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Lesson player for enrolled students (website: Student "learn" page).
/// Streams /api/videos/{id}/stream with the Sanctum token and saves progress.
class LearnScreen extends StatefulWidget {
  final String courseId;
  const LearnScreen({super.key, required this.courseId});

  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  final _api = ApiService();
  Course? _course;
  String? _error;
  int _index = 0;
  VideoPlayerController? _controller;
  bool _videoFailed = false;
  double _playbackSpeed = 1.0;
  bool _showControls = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final course = await _api.getCourseDetail(widget.courseId);
      if (!mounted) return;
      if (!course.isPurchased) {
        setState(() => _error = 'Enroll in this course to watch its lessons.');
        return;
      }
      // Start at the first unfinished lesson.
      final firstOpen = course.lessons.indexWhere((l) => !l.isCompleted);
      setState(() {
        _course = course;
        _index = firstOpen < 0 ? 0 : firstOpen;
      });
      if (course.lessons.isNotEmpty) _play(_index);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    }
  }

  Future<void> _saveProgress() async {
    final c = _controller;
    final lesson = _course?.lessons.elementAtOrNull(_index);
    if (c == null || lesson == null || !c.value.isInitialized) return;
    final pos = c.value.position.inSeconds;
    final dur = c.value.duration.inSeconds;
    final done = dur > 0 && pos >= (dur * 0.9).ceil();
    try {
      await _api.syncProgress(lesson.id, pos, done);
    } catch (_) {
      // Progress is best-effort; ignore network errors here.
    }
  }

  Future<void> _play(int index) async {
    await _saveProgress();
    final old = _controller;
    final lesson = _course!.lessons[index];
    final url = ApiConfig.mediaUrl(lesson.streamUrl);

    setState(() {
      _index = index;
      _controller = null;
      _videoFailed = false;
    });
    await old?.dispose();
    if (url == null) {
      setState(() => _videoFailed = true);
      return;
    }

    final token = ApiConfig.getAuthToken();
    final controller = VideoPlayerController.networkUrl(
      Uri.parse(url),
      httpHeaders: {if (token != null) 'Authorization': 'Bearer $token'},
    );
    try {
      await controller.initialize();
      await controller.setPlaybackSpeed(_playbackSpeed);
      if (lesson.progressSeconds > 0 && !lesson.isCompleted) {
        await controller.seekTo(Duration(seconds: lesson.progressSeconds));
      }
      if (!mounted) {
        await controller.dispose();
        return;
      }
      setState(() => _controller = controller);
      controller.play();
    } catch (_) {
      await controller.dispose();
      if (mounted) setState(() => _videoFailed = true);
    }
  }

  void _skip(int seconds) {
    final c = _controller;
    if (c == null || !c.value.isInitialized) return;
    final current = c.value.position;
    final target = current + Duration(seconds: seconds);
    final clamped = target < Duration.zero
        ? Duration.zero
        : (target > c.value.duration ? c.value.duration : target);
    c.seekTo(clamped);
  }

  void _cycleSpeed() {
    final speeds = [1.0, 1.25, 1.5, 2.0];
    final nextIdx = (speeds.indexOf(_playbackSpeed) + 1) % speeds.length;
    final next = speeds[nextIdx];
    setState(() => _playbackSpeed = next);
    _controller?.setPlaybackSpeed(next);
  }

  @override
  void dispose() {
    _saveProgress();
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final course = _course;
    final completedCount = course?.lessons.where((l) => l.isCompleted).length ?? 0;
    final totalCount = course?.lessons.length ?? 0;
    final progress = totalCount > 0 ? completedCount / totalCount : 0.0;

    return Scaffold(
      backgroundColor: Tw.page,
      appBar: AppBar(
        title: Text(course?.title ?? 'Lessons',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TwText.sans(16, weight: FontWeight.w700)),
        actions: [
          if (course != null)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Tw.copper50,
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: Tw.copper200),
                  ),
                  child: Text(
                    '$completedCount / $totalCount done',
                    style: TwText.sans(11.5, weight: FontWeight.w700, color: Tw.copper800),
                  ),
                ),
              ),
            ),
        ],
      ),
      body: _error != null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  Text(_error!, textAlign: TextAlign.center, style: TwText.sans(15)),
                  const SizedBox(height: 16),
                  SecondaryButton(
                    label: 'Back to course',
                    expand: false,
                    onPressed: () => context.pop(),
                  ),
                ]),
              ),
            )
          : course == null
              ? const Center(child: CircularProgressIndicator())
              : Column(
                  children: [
                    _player(),
                    // Progress Bar Header
                    Container(
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        border: Border(bottom: BorderSide(color: Tw.copper100)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Lesson ${_index + 1} of $totalCount',
                                style: TwText.sans(12.5,
                                    weight: FontWeight.w700, color: Tw.slate800),
                              ),
                              Text(
                                '${(progress * 100).round()}% Completed',
                                style: TwText.sans(12,
                                    weight: FontWeight.w800, color: Tw.emerald700),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(999),
                            child: LinearProgressIndicator(
                              value: progress,
                              minHeight: 6,
                              backgroundColor: Tw.slate100,
                              valueColor: const AlwaysStoppedAnimation<Color>(Tw.emerald500),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: course.lessons.isEmpty
                          ? Center(
                              child: Text('Lessons are coming soon.',
                                  style: TwText.sans(14, color: Tw.slate500)))
                          : ListView.separated(
                              padding: const EdgeInsets.all(16),
                              itemCount: course.lessons.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 10),
                              itemBuilder: (_, i) => _lessonTile(course.lessons[i], i),
                            ),
                    ),
                  ],
                ),
    );
  }

  Widget _player() {
    final c = _controller;
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Container(
        color: Tw.slate950,
        alignment: Alignment.center,
        child: _videoFailed
            ? Column(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.error_outline, color: Colors.white70, size: 40),
                const SizedBox(height: 8),
                Text('This lesson could not be played.',
                    style: TwText.sans(13, color: Colors.white70)),
                TextButton(
                    onPressed: () => _play(_index),
                    child: const Text('Try again')),
              ])
            : c == null
                ? const CircularProgressIndicator(color: Tw.gold2)
                : Stack(
                    alignment: Alignment.center,
                    children: [
                      Center(
                        child: AspectRatio(
                            aspectRatio: c.value.aspectRatio,
                            child: VideoPlayer(c)),
                      ),
                      // Overlay tap area to toggle controls
                      Positioned.fill(
                        child: GestureDetector(
                          behavior: HitTestBehavior.opaque,
                          onTap: () => setState(() => _showControls = !_showControls),
                          child: AnimatedOpacity(
                            opacity: _showControls || !c.value.isPlaying ? 1 : 0,
                            duration: const Duration(milliseconds: 200),
                            child: Container(
                              color: Colors.black.withValues(alpha: 0.35),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  // Skip backward 10s
                                  IconButton(
                                    icon: const Icon(Icons.replay_10_rounded,
                                        size: 34, color: Colors.white),
                                    onPressed: () => _skip(-10),
                                  ),
                                  const SizedBox(width: 20),
                                  // Play / Pause button
                                  InkWell(
                                    onTap: () => setState(() =>
                                        c.value.isPlaying ? c.pause() : c.play()),
                                    child: Container(
                                      width: 58,
                                      height: 58,
                                      decoration: BoxDecoration(
                                        color: Tw.copper700.withValues(alpha: 0.85),
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                            color: Tw.gold2.withValues(alpha: 0.6)),
                                      ),
                                      child: Icon(
                                        c.value.isPlaying
                                            ? Icons.pause_rounded
                                            : Icons.play_arrow_rounded,
                                        size: 36,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 20),
                                  // Skip forward 10s
                                  IconButton(
                                    icon: const Icon(Icons.forward_10_rounded,
                                        size: 34, color: Colors.white),
                                    onPressed: () => _skip(10),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      // Speed pill top-right
                      Positioned(
                        top: 10,
                        right: 10,
                        child: InkWell(
                          onTap: _cycleSpeed,
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.6),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.3)),
                            ),
                            child: Text(
                              '${_playbackSpeed}x',
                              style: TwText.sans(11,
                                  weight: FontWeight.w800, color: Tw.goldLight),
                            ),
                          ),
                        ),
                      ),
                      // Progress Bar at bottom
                      Positioned(
                        left: 0,
                        right: 0,
                        bottom: 0,
                        child: VideoProgressIndicator(
                          c,
                          allowScrubbing: true,
                          colors: const VideoProgressColors(
                            playedColor: Tw.gold2,
                            bufferedColor: Colors.white24,
                            backgroundColor: Colors.black45,
                          ),
                        ),
                      ),
                    ],
                  ),
      ),
    );
  }

  Widget _lessonTile(Lesson lesson, int i) {
    final active = i == _index;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => _play(i),
        borderRadius: BorderRadius.circular(16),
        child: Ink(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: active ? Tw.brandDeepGradient : null,
            color: active ? null : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: active
                ? null
                : Border.all(color: Tw.slate200.withValues(alpha: 0.8)),
            boxShadow: active
                ? [
                    BoxShadow(
                      color: Tw.copper700.withValues(alpha: 0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : Tw.sm,
          ),
          child: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: active
                      ? Colors.white.withValues(alpha: 0.22)
                      : lesson.isCompleted
                          ? Tw.emerald100
                          : Tw.copper50,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: lesson.isCompleted
                    ? Icon(Icons.check,
                        size: 18, color: active ? Colors.white : Tw.emerald600)
                    : Text('${i + 1}',
                        style: TwText.sans(13,
                            weight: FontWeight.w700,
                            color: active ? Colors.white : Tw.copper700)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(lesson.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TwText.sans(14,
                        weight: FontWeight.w600,
                        color: active ? Colors.white : Tw.slate800)),
              ),
              if (lesson.durationLabel != null)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: active
                        ? Colors.white.withValues(alpha: 0.15)
                        : Tw.slate100,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    lesson.durationLabel!,
                    style: TwText.sans(11.5,
                        weight: FontWeight.w600,
                        color: active ? Colors.white70 : Tw.slate600),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
