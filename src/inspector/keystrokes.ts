import {Inspector} from "./inspector";

export default function(inspector: Inspector) {
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
    'alt+left': () => {
      if (isLegendVisible()) {
        return
      }
      const next_pos = Math.max(0, inspector.data_service.position - 1)
      inspector.states.add('TimelineScrolled', next_pos)
    },
    'alt+right': () => {
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
      inspector.states.add('PlayStopClicked')
    },
    esc: () => {
      inspector.states.drop('LegendVisible')
      inspector.states.drop('ConnectionDialogVisible')
    },
    right(e) {
      inspector.graph.onArrowListener('right', e)
    },
    left(e) {
      inspector.graph.onArrowListener('left', e)
    },
    up(e) {
      inspector.graph.onArrowListener('up', e)
    },
    down(e) {
      inspector.graph.onArrowListener('down', e)
    },
    'ctrl + g'() {
      inspector.graph.container.focus()
    }
  }
}
