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

  static async getTyCLabel() {
    const response = await InAppTextsService.getTyCLabel();
    return response;
  }

  static async updateTyCLabel(html) {
    const response = await InAppTextsService.updateTyCLabel(html);
    return response;
  }
}
