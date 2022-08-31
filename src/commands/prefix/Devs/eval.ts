import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} from "discord.js"
import { Command, Types } from "../../../../index"
import { PrefixBuilder } from "../../../auxiliar/builders"
import * as ts from "typescript"

export const command: Command<Types.Prefix> = {
    data: new PrefixBuilder()
        .setNames("eval", "e")
        .setExplan(
            "Los desarrolladores pueden evaluar un código con este comando.",
            "Developers can use this command to evaluate a code.",
            "Os desenvolvedores podem usar este comando para avaliar um código."
        )
        .setUsage("<Código>", "<Code>", "<Código>")
        .setDev(true),
    code: async (d) => {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("delete_eval")
                .setStyle(ButtonStyle.Danger)
                .setLabel("Borrar")
                .setEmoji("crosss:879462519129923594")
        )
        let input = d.args.join(" ")
        if (input.includes("--async")) {
            const imports = input.match(/import .+ from (".+");?/g)
            if (imports?.length) {
                for (const imp of imports) {
                    input = input.replace(imp, "")
                }
            }
            input = `${imports?.join("\n") || ""}(async() => { ${input.replace(
                /^\n+/g,
                ""
            )} })()`.replace("--async", "")
        }
        const depth = input.match(/--depth [\d]{1,2}/gim)?.[0]
        if (depth) input = input.replace(depth, "").trim()
        input = ts.transpile(input)
        try {
            let result: any = await eval(input)
            if (typeof result === "object") {
                result = require("util").inspect(result, {
                    depth: depth ? parseInt(depth.split(" ")[1]) : 0
                })
            } else if (typeof result === "function") {
                result = result.toString()
            } else {
                result = require("util").inspect(result)
            }
            result = result
            d.message.channel
                .send({
                    content: `\`\`\`ts\n# Result:\n${result}\`\`\``
                        .replaceAll(d.client.token!, "[UNI_TOKEN]")
                        .replaceAll(process.env.NAME!, "Mi mama"),
                    components: [row]
                })
                .then((m) => {
                    const collector = m.createMessageComponentCollector({
                        componentType: ComponentType.Button
                    })
                    collector.on("collect", (i) => {
                        if (i.customId !== "delete_eval") return
                        if (i.user.id !== d.message.author.id) return
                        //@ts-ignore
                        i.followUp({
                            content: "Esta mierda fue eliminada xd"
                        }).catch((e) => null)
                        m.delete().catch(() => null)
                    })
                    //@ts-ignore
                })
                .catch((e) => null)
        } catch (err: any) {
            d.message.channel.send(
                `\`\`\`ansi\nError:\n${err
                    ?.toString()
                    .replaceAll(d.client.token!, "CLIENT_TOKEN")
                    .replaceAll(process.env.NAME!, "Math")}\`\`\``
            )
        }
    }
}
