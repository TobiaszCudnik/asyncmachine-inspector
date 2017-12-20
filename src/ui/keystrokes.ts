export default function(inspector) {
  const isLegendVisible = () => inspector.states.is('LegendVisible')
  return {
    'shift + /': () => {
      // TODO use #toggle
      if (inspector.states.is('LegendVisible')) {
        inspector.states.drop('LegendVisible')
      } else {
        inspector.states.add('LegendVisible')
      }
    },
    left: () => {
      if (isLegendVisible()) {
        return
      }
      const next_pos = Math.max(0, inspector.data_service.position - 1)
      inspector.states.add('TimelineScrolled', next_pos)
    },
    right: () => {
      if (isLegendVisible()) {
        return
      }
      const next_pos = Math.min(
        inspector.data_service.position + 1,
        inspector.data_service.position_max
      )
      inspector.states.add('TimelineScrolled', next_pos)
    },
    space: () => {
      if (isLegendVisible()) {
        return
      }
      // TODO use #toggle
      if (inspector.states.is('Playing')) {
        inspector.states.drop('Playing')
      } else {
        inspector.states.add('Playing')
      }
    },
    esc: () => {
      inspector.states.drop('LegendVisible')
    }
  }
}
