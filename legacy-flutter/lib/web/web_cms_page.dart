import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/web/cms_content_service.dart';
import 'package:web_teamital/web/web_footer.dart';
import 'package:web_teamital/web/web_home_slots.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_seo.dart';
import 'package:web_teamital/web/web_site_header.dart';

/// Renders a published CMS page using the same section types as Landing/Home.
class WebCmsPage extends StatefulWidget {
  const WebCmsPage({super.key, required this.slug});

  final String slug;

  @override
  State<WebCmsPage> createState() => _WebCmsPageState();
}

class _WebCmsPageState extends State<WebCmsPage> {
  StreamSubscription<Map<String, CmsPageContent>>? _sub;
  CmsPageContent? _page;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    final cms = CmsContentService.instance;
    unawaited(cms.start().then((_) {
      if (!mounted) return;
      setState(() {
        _page = cms.page(widget.slug);
        _ready = true;
      });
      WebSeo.applyForPath('/${widget.slug}');
    }));
    _sub = cms.pagesStream.listen((pages) {
      if (!mounted) return;
      setState(() {
        _page = pages[widget.slug];
        _ready = true;
      });
      WebSeo.applyForPath('/${widget.slug}');
    });
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  void _go(String href) {
    final path = href.trim().isEmpty ? '/' : href.trim();
    if (path.startsWith('http')) return;
    WebRoutes.push(context, path.startsWith('/') ? path : '/$path');
  }

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final page = _page;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const WebSiteHeader(current: WebSitePage.home),
          Expanded(
            child: !_ready
                ? const Center(child: CircularProgressIndicator())
                : page == null
                    ? _Missing(slug: widget.slug)
                    : SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            for (final block in page.blocks) ...[
                              _buildBlock(block, w),
                              const SizedBox(height: 8),
                            ],
                            if (page.blocks.isEmpty)
                              Padding(
                                padding: EdgeInsets.symmetric(
                                  horizontal: w < 900 ? 20 : 80,
                                  vertical: 48,
                                ),
                                child: Text(
                                  page.h1.isNotEmpty ? page.h1 : page.title,
                                  style: GoogleFonts.poppins(
                                    fontSize: 36,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            const WebMarketingFooter(),
                          ],
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildBlock(CmsBlock block, double w) {
    switch (block.type) {
      case 'slot':
        return Padding(
          padding: EdgeInsets.symmetric(horizontal: w < 900 ? 16 : 48, vertical: 24),
          child: buildHomeSlot(
            block.toHomeSlot(),
            w,
            onPrimary: () => _go(block.buttonHref.isEmpty ? '/contact' : block.buttonHref),
            onSecondary: () => _go(block.button2Href.isEmpty ? '/sign-up' : block.button2Href),
          ),
        );
      case 'hero':
        return _HeroBlock(block: block, width: w, onGo: _go);
      case 'h2':
      case 'h3':
      case 'features':
      case 'content':
      case 'benefits':
      case 'cta':
      case 'faq':
      case 'testimonials':
      case 'lead_form':
      default:
        return _GenericBlock(block: block, width: w, onGo: _go);
    }
  }
}

class _Missing extends StatelessWidget {
  const _Missing({required this.slug});
  final String slug;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Page not found',
                style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Text('/$slug is not published in CMS yet.',
                style: GoogleFonts.poppins(color: const Color(0xFF6B7280))),
            const SizedBox(height: 20),
            TextButton(
              onPressed: () => WebRoutes.push(context, WebRoutes.home),
              child: const Text('Go home'),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroBlock extends StatelessWidget {
  const _HeroBlock({required this.block, required this.width, required this.onGo});
  final CmsBlock block;
  final double width;
  final void Function(String) onGo;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 900;
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: narrow ? 20 : 80, vertical: narrow ? 48 : 72),
      color: const Color(0xFFF8FAFC),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            block.heading.isEmpty ? 'Welcome' : block.heading,
            style: GoogleFonts.poppins(
              fontSize: narrow ? 34 : 48,
              fontWeight: FontWeight.w800,
              height: 1.1,
              color: AppColors.masterPrimary,
            ),
          ),
          if (block.body.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(block.body,
                style: GoogleFonts.poppins(fontSize: 17, height: 1.55, color: const Color(0xFF4B5563))),
          ],
          const SizedBox(height: 28),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              if (block.buttonLabel.isNotEmpty)
                FilledButton(
                  onPressed: () => onGo(block.buttonHref.isEmpty ? '/sign-up' : block.buttonHref),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.masterPrimary,
                    padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                  ),
                  child: Text(block.buttonLabel),
                ),
              if (block.button2Label.isNotEmpty)
                OutlinedButton(
                  onPressed: () => onGo(block.button2Href.isEmpty ? '/contact' : block.button2Href),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                  ),
                  child: Text(block.button2Label),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _GenericBlock extends StatelessWidget {
  const _GenericBlock({required this.block, required this.width, required this.onGo});
  final CmsBlock block;
  final double width;
  final void Function(String) onGo;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 900;
    final isBanner = block.type == 'cta' || block.variant == 'ask-banner';
    return Container(
      width: double.infinity,
      margin: EdgeInsets.symmetric(horizontal: narrow ? 16 : 48, vertical: 20),
      padding: EdgeInsets.all(narrow ? 24 : 40),
      decoration: BoxDecoration(
        color: isBanner ? AppColors.masterPrimary : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: isBanner ? null : Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (block.heading.isNotEmpty)
            Text(
              block.heading,
              style: GoogleFonts.poppins(
                fontSize: narrow ? 26 : 34,
                fontWeight: FontWeight.w800,
                color: isBanner ? Colors.white : const Color(0xFF111827),
              ),
            ),
          if (block.body.isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(
              block.body,
              style: GoogleFonts.poppins(
                fontSize: 16,
                height: 1.55,
                color: isBanner ? Colors.white.withValues(alpha: 0.9) : const Color(0xFF4B5563),
              ),
            ),
          ],
          if (block.items.isNotEmpty) ...[
            const SizedBox(height: 16),
            for (final line in block.items)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('•  ',
                        style: TextStyle(
                            color: isBanner ? Colors.white : AppColors.masterPrimary,
                            fontWeight: FontWeight.w700)),
                    Expanded(
                      child: Text(
                        line.replaceAll('|', ' — '),
                        style: GoogleFonts.poppins(
                          fontSize: 15,
                          height: 1.45,
                          color: isBanner ? Colors.white : const Color(0xFF374151),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
          if (block.buttonLabel.isNotEmpty || block.button2Label.isNotEmpty) ...[
            const SizedBox(height: 20),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                if (block.buttonLabel.isNotEmpty)
                  FilledButton(
                    onPressed: () => onGo(block.buttonHref.isEmpty ? '/sign-up' : block.buttonHref),
                    style: FilledButton.styleFrom(
                      backgroundColor: isBanner ? Colors.white : AppColors.masterPrimary,
                      foregroundColor: isBanner ? AppColors.masterPrimary : Colors.white,
                    ),
                    child: Text(block.buttonLabel),
                  ),
                if (block.button2Label.isNotEmpty)
                  OutlinedButton(
                    onPressed: () => onGo(block.button2Href.isEmpty ? '/contact' : block.button2Href),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isBanner ? Colors.white : AppColors.masterPrimary,
                      side: BorderSide(color: isBanner ? Colors.white : AppColors.masterPrimary),
                    ),
                    child: Text(block.button2Label),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
