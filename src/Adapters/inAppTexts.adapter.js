import { InAppTextsService } from "../Services/inAppTexts.service";

export class InAppTextsAdapter {
  static async getLabels() {
    const response = await InAppTextsService.getLabels();
    return response;
  }
  static async editLabels(labelsArray) {
    const response = await InAppTextsService.editLabels(labelsArray);
    return response;
  }
}
