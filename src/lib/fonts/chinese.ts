import { loadFileOnEdge } from '../edge';

const CHINESE_URL = '/fonts/chinese/ZCOOLQingKeHuangYou-Regular.ttf';

const chinese = () => loadFileOnEdge(CHINESE_URL);

export default chinese;
