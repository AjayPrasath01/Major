package com.srm.machinemonitor.Configs;

import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import com.srm.machinemonitor.Processors.SourceToTargetEntityProcessor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.*;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

import javax.sql.DataSource;

@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private DataSource dataSource;

//    @Value("#{jobParameters[ids]}")
//    private String ids;

    @Bean
    public Job transferJob(ItemReader<DevData> sourceItemReader) {
        return jobBuilderFactory.get("transferJob")
                .incrementer(new RunIdIncrementer())
                .flow(transferStep(sourceItemReader))
                .end()
                .build();
    }

    @Bean
    public Step transferStep(ItemReader<DevData> sourceItemReader) {
//        System.out.println("transfer step : ");
//        System.out.println(ids);
        return stepBuilderFactory.get("transferStep")
                .<DevData, Data>chunk(1)
                .reader(sourceItemReader)
                .processor(processor())
                .writer(targetItemWriter())
                .build();
    }

    @Bean
    @StepScope
    public ItemReader<DevData> sourceItemReader(@Value("#{jobParameters[ids]}") String ids) {
        JdbcCursorItemReader<DevData> itemReader = new JdbcCursorItemReader<>();
        itemReader.setDataSource(dataSource);
        itemReader.setSql("SELECT * FROM DevData WHERE id IN (" + ids + ")");
        itemReader.setRowMapper(new BeanPropertyRowMapper<>(DevData.class));
        itemReader.open(new ExecutionContext());
        return itemReader;
    }

    @Bean
    public ItemProcessor<DevData, Data> processor() {
        return new SourceToTargetEntityProcessor();
    }

    @Bean
    public ItemWriter<Data> targetItemWriter() {
        JdbcBatchItemWriter<Data> itemWriter = new JdbcBatchItemWriter<>();
        itemWriter.setDataSource(dataSource);
        itemWriter.setSql("INSERT INTO data (data_type, date, machineId, value) VALUES (:data_type, :date, :machineId, :value)");
        itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>());
        return itemWriter;
    }
}

