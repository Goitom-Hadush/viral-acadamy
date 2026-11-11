import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/config/constants.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/models/content_models.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/async_content.dart';
import 'package:success_life_coaching_app/widgets/brand.dart';

/// Mirrors the website "Reels" page (GET /api/content/reels).
class ReelsScreen extends StatelessWidget {
  const ReelsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SiteScaffold(
      currentRoute: '/reels',
      body: AsyncContent<List<Reel>>(
        load: () => ApiService().getReels(),
        builder: (context, reels) {
          return CustomScrollView(
            slivers: [
              const SliverPadding(
                padding: EdgeInsets.fromLTRB(16, 24, 16, 20),
                sliver: SliverToBoxAdapter(
                  child: PageIntro(
                    chip: '🎬 Video Reels',
                    title: 'Course Reels & Highlights',
                    subtitle:
                        'Watch concise bite-sized masterclasses, success tips, and preview clips. Tap any clip to open the full course.',
                  ),
                ),
              ),
              if (reels.isEmpty)
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                  sliver: SliverToBoxAdapter(
                    child: SurfaceCard(
                      padding: const EdgeInsets.all(28),
                      child: Column(
                        children: [
                          const Text('🎬', style: TextStyle(fontSize: 40)),
                          const SizedBox(height: 12),
                          Text('Fresh Reels Coming Soon!',
                              textAlign: TextAlign.center,
                              style: TwText.sans(18, weight: FontWeight.w800)),
                          const SizedBox(height: 8),
                          Text(
                            'Our instructors and coaches are preparing new vertical video masterclasses for you. In the meantime, browse our full course catalog!',
                            textAlign: TextAlign.center,
                            style: TwText.sans(13,
                                color: Tw.slate600, height: 1.6),
                          ),
                          const SizedBox(height: 20),
                          PrimaryButton(
                              label: 'Browse All Courses',
                              onPressed: () => context.go('/courses')),
                        ],
                      ),
                    ),
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                  sliver: SliverGrid.builder(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 9 / 15,
                    ),
                    itemCount: reels.length,
                    itemBuilder: (context, i) => _ReelTile(reel: reels[i]),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}

class _ReelTile extends StatelessWidget {
  final Reel reel;
  const _ReelTile({required this.reel});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () => Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => ReelViewer(reel: reel)),
          ),
          child: Stack(
            fit: StackFit.expand,
            children: [
              BrandImage(
                url: reel.isVideo ? reel.courseThumbnail : reel.mediaUrl,
                borderRadius: BorderRadius.circular(20),
              ),
              // Dark gradient so text and badges are crystal clear
              DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.35),
                      Colors.transparent,
                      Colors.black.withValues(alpha: 0.85),
                    ],
                    stops: const [0.0, 0.4, 1.0],
                  ),
                ),
              ),
              // Top tag
              Positioned(
                top: 10,
                left: 10,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                        color: Colors.white.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.videocam_rounded,
                          size: 13, color: Tw.goldLight),
                      const SizedBox(width: 4),
                      Text(
                        'REEL',
                        style: TwText.eyebrow(9, Colors.white,
                            trackingEm: 0.08),
                      ),
                    ],
                  ),
                ),
              ),
              if (reel.isVideo)
                Center(
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Tw.copper700.withValues(alpha: 0.8),
                      shape: BoxShape.circle,
                      border: Border.all(
                          color: Tw.gold2.withValues(alpha: 0.6), width: 1.5),
                    ),
                    child: const Icon(Icons.play_arrow_rounded,
                        size: 30, color: Colors.white),
                  ),
                ),
              Positioned(
                left: 12,
                right: 12,
                bottom: 12,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (reel.courseTitle != null) ...[
                      Text(
                        reel.courseTitle!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TwText.eyebrow(9.5, Tw.goldLight,
                            trackingEm: 0.05),
                      ),
                      const SizedBox(height: 3),
                    ],
                    Text(
                      reel.caption ?? reel.courseTitle ?? '',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TwText.sans(
                        13,
                        weight: FontWeight.w700,
                        color: Colors.white,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Full-screen reel: plays videos (tap to pause) or shows the image.
class ReelViewer extends StatefulWidget {
  final Reel reel;
  const ReelViewer({super.key, required this.reel});

  @override
  State<ReelViewer> createState() => _ReelViewerState();
}

class _ReelViewerState extends State<ReelViewer> {
  VideoPlayerController? _controller;
  bool _failed = false;

  @override
  void initState() {
    super.initState();
    final url = ApiConfig.mediaUrl(widget.reel.mediaUrl);
    if (widget.reel.isVideo && url != null) {
      final controller = VideoPlayerController.networkUrl(Uri.parse(url));
      _controller = controller;
      controller.setLooping(true);
      controller.initialize().then((_) {
        if (mounted) {
          setState(() {});
          controller.play();
        }
      }).catchError((_) {
        if (mounted) setState(() => _failed = true);
      });
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reel = widget.reel;
    final controller = _controller;

    Widget media;
    if (!reel.isVideo) {
      media = BrandImage(url: reel.mediaUrl);
    } else if (_failed) {
      media = const Icon(Icons.error_outline, color: Colors.white70, size: 48);
    } else if (controller == null || !controller.value.isInitialized) {
      media = const CircularProgressIndicator(color: Colors.white);
    } else {
      media = GestureDetector(
        onTap: () => setState(() {
          controller.value.isPlaying ? controller.pause() : controller.play();
        }),
        child: Stack(
          alignment: Alignment.center,
          children: [
            AspectRatio(
              aspectRatio: controller.value.aspectRatio,
              child: VideoPlayer(controller),
            ),
            if (!controller.value.isPlaying)
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.6),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white.withValues(alpha: 0.5)),
                ),
                child: const Icon(Icons.play_arrow_rounded,
                    size: 40, color: Colors.white),
              ),
          ],
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: Text(reel.courseTitle ?? 'Reel',
            style: TwText.sans(16, weight: FontWeight.w700, color: Colors.white)),
      ),
      body: Column(
        children: [
          Expanded(child: Center(child: media)),
          if (reel.caption != null || reel.courseId != null)
            SafeArea(
              top: false,
              child: Container(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.8),
                  border: const Border(top: BorderSide(color: Colors.white12)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        reel.caption ?? reel.courseTitle ?? '',
                        style: TwText.sans(14,
                            color: Colors.white, weight: FontWeight.w500),
                      ),
                    ),
                    if (reel.courseId != null) ...[
                      const SizedBox(width: 12),
                      ElevatedButton(
                        onPressed: () =>
                            context.push('/courses/${reel.courseId}'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Tw.gold2,
                          foregroundColor: Tw.slate950,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 10),
                          textStyle:
                              TwText.sans(12.5, weight: FontWeight.w800),
                        ),
                        child: Text(context.tr('reels.view_course')),
                      ),
                    ],
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
