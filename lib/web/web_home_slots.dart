import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/web/cms_content_service.dart';

Widget buildHomeSlot(
  HomeSlot slot,
  double width, {
  required VoidCallback onPrimary,
  required VoidCallback onSecondary,
}) {
  switch (slot.variant) {
    case 'ops-board':
      return _OpsSection(slot: slot, width: width, onPrimary: onPrimary, onSecondary: onSecondary);
    case 'feature-chart':
      return _FeatureChart(slot: slot, width: width);
    case 'story-rows':
      return _StoryRows(slot: slot, width: width);
    case 'ai-insight':
      return _AiInsight(slot: slot, width: width, onPrimary: onPrimary);
    case 'topic-menu':
      return _TopicMenu(slot: slot, width: width, onPrimary: onPrimary);
    case 'ask-banner':
      return _AskBanner(slot: slot, width: width, onPrimary: onPrimary, onSecondary: onSecondary);
    default:
      return _DeviceTracking(slot: slot, width: width);
  }
}

class _DeviceTracking extends StatelessWidget {
  const _DeviceTracking({required this.slot, required this.width});
  final HomeSlot slot;
  final double width;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 900;
    final lines = slot.items.isEmpty
        ? const ['Manual timer start and stop', 'Project and task selection', 'Optional photos', 'App tracking']
        : slot.items;
    final copy = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(slot.heading.isEmpty ? 'Personal device tracking' : slot.heading,
            style: GoogleFonts.poppins(fontSize: narrow ? 32 : 42, fontWeight: FontWeight.w800, color: AppColors.masterPrimary, height: 1.1)),
        const SizedBox(height: 14),
        Text(slot.body.isEmpty ? 'Employees clock in on their own devices, and tracking stops when they clock out.' : slot.body,
            style: GoogleFonts.poppins(fontSize: 16, height: 1.55, color: const Color(0xFF4B5563))),
        const SizedBox(height: 16),
        for (final line in lines)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(children: [
              const Icon(Icons.circle, size: 6, color: Color(0xFF1A56DB)),
              const SizedBox(width: 10),
              Expanded(child: Text(line, style: GoogleFonts.poppins(fontSize: 15))),
            ]),
          ),
      ],
    );
    final card = Container(
      height: 280,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(24)),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: const [BoxShadow(color: Color(0x221A56DB), blurRadius: 18)]),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
            decoration: BoxDecoration(color: AppColors.masterPrimary, borderRadius: BorderRadius.circular(10)),
            child: Text('00:21:25', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 22)),
          ),
          const SizedBox(height: 8),
          Text('On site', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
          Text('Total today 8:12', style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280))),
        ]),
      ),
    );
    return _pad(narrow, narrow ? Column(children: [copy, const SizedBox(height: 24), card]) : Row(children: [Expanded(child: copy), const SizedBox(width: 32), Expanded(child: card)]));
  }
}

class _OpsSection extends StatelessWidget {
  const _OpsSection({required this.slot, required this.width, required this.onPrimary, required this.onSecondary});
  final HomeSlot slot;
  final double width;
  final VoidCallback onPrimary;
  final VoidCallback onSecondary;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 960;
    final copy = Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(slot.heading.isEmpty ? 'See how your team spends the day' : slot.heading,
          style: GoogleFonts.poppins(fontSize: narrow ? 32 : 42, height: 1.1, fontWeight: FontWeight.w800)),
      const SizedBox(height: 12),
      Text(slot.body.isEmpty ? 'Live attendance, breaks, and hours in one view.' : slot.body,
          style: GoogleFonts.poppins(fontSize: 16, height: 1.5, color: const Color(0xFF4B5563))),
      const SizedBox(height: 18),
      Wrap(spacing: 10, runSpacing: 10, children: [
        _pill(slot.button.isEmpty ? 'Book a demo' : slot.button, true, onPrimary),
        _pill(slot.button2.isEmpty ? 'Start free trial' : slot.button2, false, onSecondary),
      ]),
    ]);
    return _pad(narrow, narrow ? Column(crossAxisAlignment: CrossAxisAlignment.start, children: [copy, const SizedBox(height: 24), const _MiniBoard()]) : Row(crossAxisAlignment: CrossAxisAlignment.center, children: [Expanded(flex: 5, child: copy), const SizedBox(width: 24), const Expanded(flex: 6, child: _MiniBoard())]));
  }
}

class _FeatureChart extends StatelessWidget {
  const _FeatureChart({required this.slot, required this.width});
  final HomeSlot slot;
  final double width;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 900;
    final lines = slot.items.isEmpty
        ? const ['Real-time monitoring|See who is on site right now.', 'Time and attendance|Hours are recorded as people clock in.', 'Manual entries|Add a missing punch when needed.', 'Reports|Review hours by team and day.']
        : slot.items;
    final list = Column(children: [
      for (var i = 0; i < lines.length; i++)
        Container(
          width: double.infinity,
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: i == lines.length - 1 ? const Color(0xFFEFF6FF) : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(lines[i].split('|').first, style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
            if (lines[i].contains('|')) Text(lines[i].split('|').last, style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280))),
          ]),
        ),
    ]);
    const chart = _BarCard();
    return _pad(narrow, narrow ? Column(children: [list, const SizedBox(height: 16), chart]) : Row(crossAxisAlignment: CrossAxisAlignment.start, children: [Expanded(flex: 4, child: list), const SizedBox(width: 24), const Expanded(flex: 6, child: chart)]));
  }
}

class _StoryRows extends StatelessWidget {
  const _StoryRows({required this.slot, required this.width});
  final HomeSlot slot;
  final double width;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 800;
    final lines = slot.items.length >= 2 ? slot.items : const ['Clearer project estimates|Hours show how long work really takes.', 'Spot overload early|See when a team is carrying too many hours.'];
    Widget row(String raw, bool flip) {
      final parts = raw.split('|');
      final text = Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(parts.first, style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        Text(parts.length > 1 ? parts[1] : '', style: GoogleFonts.poppins(fontSize: 15, height: 1.5, color: const Color(0xFF4B5563))),
      ]);
      final art = ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Image.asset(
          flip ? 'assets/home/workload.jpg' : 'assets/home/estimates.jpg',
          height: 220,
          width: double.infinity,
          fit: BoxFit.cover,
        ),
      );
      if (narrow) return Column(children: [art, const SizedBox(height: 12), text]);
      return Row(children: flip ? [Expanded(child: art), const SizedBox(width: 24), Expanded(child: text)] : [Expanded(child: text), const SizedBox(width: 24), Expanded(child: art)]);
    }
    return _pad(narrow, Column(children: [row(lines[0], false), const SizedBox(height: 28), row(lines[1], true)]));
  }
}

class _AiInsight extends StatelessWidget {
  const _AiInsight({required this.slot, required this.width, required this.onPrimary});
  final HomeSlot slot;
  final double width;
  final VoidCallback onPrimary;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 900;
    final lines = slot.items.isEmpty ? const ['Average day is about 8 hours', 'On-site rate is steady this week', 'One team is over the usual hours'] : slot.items;
    final copy = Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(slot.heading.isEmpty ? 'A clearer view of the workday' : slot.heading, style: GoogleFonts.poppins(fontSize: narrow ? 32 : 42, fontWeight: FontWeight.w800, height: 1.1)),
      const SizedBox(height: 12),
      Text(slot.body.isEmpty ? 'Attendance and hours, summarized so managers can act on the day, not guess.' : slot.body, style: GoogleFonts.poppins(fontSize: 16, height: 1.5, color: const Color(0xFF4B5563))),
      const SizedBox(height: 16),
      _pill(slot.button.isEmpty ? 'Start free trial' : slot.button, true, onPrimary),
    ]);
    final chat = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFE5E7EB))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Today', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        for (final line in lines) Padding(padding: const EdgeInsets.only(bottom: 6), child: Text('• $line', style: GoogleFonts.poppins(fontSize: 14))),
      ]),
    );
    return _pad(narrow, narrow ? Column(children: [copy, const SizedBox(height: 20), chat]) : Row(crossAxisAlignment: CrossAxisAlignment.center, children: [Expanded(child: copy), const SizedBox(width: 28), Expanded(child: chat)]));
  }
}

class _TopicMenu extends StatelessWidget {
  const _TopicMenu({required this.slot, required this.width, required this.onPrimary});
  final HomeSlot slot;
  final double width;
  final VoidCallback onPrimary;

  @override
  Widget build(BuildContext context) {
    final narrow = width < 900;
    final topics = slot.items.isEmpty ? const ['Leave requests', 'Clock in and out', 'Shifts', 'Reports'] : slot.items;
    final menu = Column(children: [
      for (var i = 0; i < topics.length; i++)
        Container(
          width: double.infinity,
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(color: i == 0 ? AppColors.masterPrimary : Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE5E7EB))),
          child: Text(topics[i], style: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: i == 0 ? Colors.white : const Color(0xFF111827))),
        ),
    ]);
    final panel = Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(slot.heading.isEmpty ? 'Leave your team can request' : slot.heading, style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w800)),
      const SizedBox(height: 10),
      Text(slot.body.isEmpty ? 'People see their balance, request time off, and managers approve it in the same place.' : slot.body, style: GoogleFonts.poppins(fontSize: 15, height: 1.5, color: const Color(0xFF4B5563))),
      const SizedBox(height: 16),
      _pill(slot.button.isEmpty ? 'Open leave' : slot.button, true, onPrimary),
    ]);
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: narrow ? 16 : 48, vertical: 12),
      child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 1140), child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE5E7EB))),
        child: narrow ? Column(children: [menu, const SizedBox(height: 16), panel]) : Row(crossAxisAlignment: CrossAxisAlignment.start, children: [SizedBox(width: 260, child: menu), const SizedBox(width: 24), Expanded(child: panel)]),
      ))),
    );
  }
}

class _AskBanner extends StatelessWidget {
  const _AskBanner({required this.slot, required this.width, required this.onPrimary, required this.onSecondary});
  final HomeSlot slot;
  final double width;
  final VoidCallback onPrimary;
  final VoidCallback onSecondary;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: width < 800 ? 16 : 48, vertical: 16),
      child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 1140), child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 36),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF1A56DB), Color(0xFF0EA5E9)]),
          borderRadius: BorderRadius.circular(28),
        ),
        child: Column(children: [
          Text(slot.heading.isEmpty ? 'Want a closer look?' : slot.heading, textAlign: TextAlign.center, style: GoogleFonts.poppins(color: Colors.white, fontSize: width < 800 ? 28 : 36, fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          Text(slot.body.isEmpty ? 'Book a demo or start a free trial. No credit card required.' : slot.body, textAlign: TextAlign.center, style: GoogleFonts.poppins(color: Colors.white70, fontSize: 15)),
          const SizedBox(height: 18),
          Wrap(spacing: 10, runSpacing: 10, alignment: WrapAlignment.center, children: [
            _pill(slot.button.isEmpty ? 'Book a demo' : slot.button, false, onPrimary),
            _pill(slot.button2.isEmpty ? 'Start free trial' : slot.button2, false, onSecondary),
          ]),
        ]),
      ))),
    );
  }
}

class _MiniBoard extends StatelessWidget {
  const _MiniBoard();
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: const [BoxShadow(color: Color(0x141A56DB), blurRadius: 20)]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Activities', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        for (final row in [('Ayesha', 0.9), ('Hamza', 0.35), ('Sara', 0.7)])
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(children: [
              Text(row.$1, style: GoogleFonts.poppins(fontSize: 13)),
              const SizedBox(width: 8),
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(value: row.$2, minHeight: 8, color: AppColors.masterPrimary, backgroundColor: const Color(0xFFE5E7EB)),
                ),
              ),
            ]),
          ),
      ]),
    );
  }
}

class _BarCard extends StatelessWidget {
  const _BarCard();
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 260,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFE5E7EB))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Hours this week', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        const SizedBox(height: 16),
        Expanded(child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
          for (final h in [40.0, 70.0, 55.0, 90.0, 64.0, 78.0, 48.0])
            Expanded(child: Padding(padding: const EdgeInsets.symmetric(horizontal: 3), child: Container(height: h, decoration: BoxDecoration(color: AppColors.masterPrimary, borderRadius: BorderRadius.circular(4))))),
        ])),
      ]),
    );
  }
}

Widget _pad(bool narrow, Widget child) {
  return Container(
    width: double.infinity,
    color: Colors.white,
    padding: EdgeInsets.fromLTRB(narrow ? 20 : 56, 20, narrow ? 20 : 56, 28),
    child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 1140), child: child)),
  );
}

Widget _pill(String label, bool filled, VoidCallback onTap) {
  return Material(
    color: filled ? AppColors.masterPrimary : Colors.white,
    shape: StadiumBorder(side: filled ? BorderSide.none : const BorderSide(color: Color(0xFF93C5FD), width: 1.5)),
    clipBehavior: Clip.antiAlias,
    child: InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: filled ? Colors.white : AppColors.masterPrimary)),
      ),
    ),
  );
}
