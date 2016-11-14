import mockServer from '../../src/server/mock-server'
import mock_graph from '../fixtures/data-joint-graph'
import 'source-map-support/register'
// TODO random free port
mockServer(mock_graph).listen(3030)