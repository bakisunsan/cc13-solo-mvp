import { mount } from "@vue/test-utils";
import PrivateNote from "../../src/components/PrivateNote";

describe("PrivateNote", () => {
    test("is a Vue instance", () => {
        // Setup
        const wrapper = mount(PrivateNote);

        // Execute, Assertion
        expect(wrapper.isVueInstance()).toBeTruthy();

        // Teardown
        wrapper.destroy();
    });
});