export default function(inspector) {
  return {
    'shift + /': () => {
      inspector.layout_data.is_legend_visible = !inspector.layout_data
        .is_legend_visible
      inspector.renderUI()
    },
    left: () => {
      const next_pos = Math.max(0, inspector.data_service.position - 1)
      inspector.states.add('TimelineScrolled', next_pos)
    },
    right: () => {
      const next_pos = Math.min(
        inspector.data_service.position + 1,
        inspector.data_service.position_max
      )
      inspector.states.add('TimelineScrolled', next_pos)
    },
    space: () => {
      if (inspector.states.is('Playing')) inspector.states.drop('Playing')
      else inspector.states.add('Playing')
    },
    esc: () => {
      inspector.layout_data.is_legend_visible = false
      inspector.renderUI()
    }
  }
}
